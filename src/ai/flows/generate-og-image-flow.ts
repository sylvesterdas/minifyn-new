
'use server';
/**
 * @fileOverview Generates a background image for an OG Image.
 *
 * - generateOgImage - A function that creates a background image from a title and tags.
 * - GenerateOgImageInput - The input type for the function.
 * - GenerateOgImageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOgImageInputSchema = z.object({
  title: z.string().describe('The title of the blog post or page.'),
  tags: z.string().optional().describe('A comma-separated list of relevant tags or keywords.'),
});
export type GenerateOgImageInput = z.infer<typeof GenerateOgImageInputSchema>;

const GenerateOgImageOutputSchema = z.object({
  imageUrl: z.string().describe("The data URI of the generated image. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateOgImageOutput = z.infer<typeof GenerateOgImageOutputSchema>;

const IMAGE_MODELS = [
  'googleai/gemini-2.0-flash-exp-image-generation',
  ...(process.env.ENABLE_PREMIUM_IMAGE_MODEL === 'true'
    ? (['googleai/gemini-2.5-flash-image'] as const)
    : ([] as const)),
] as const;

// This is the main function that will be called from our application code.
export async function generateOgImage(input: GenerateOgImageInput): Promise<GenerateOgImageOutput> {
  return generateOgImageFlow(input);
}

// Define the Genkit Flow
const generateOgImageFlow = ai.defineFlow(
  {
    name: 'generateOgImageFlow',
    inputSchema: GenerateOgImageInputSchema,
    outputSchema: GenerateOgImageOutputSchema,
  },
  async (input) => {
    console.log(`Generating OG background for: ${input.title}`);
    
    // Step 1: Generate a high-quality prompt for the image model.
    // This uses an AI to write a prompt for another AI.
    const promptGenerationResponse = await ai.generate({
      prompt: `You are an expert prompt engineer for a generative image model. Your task is to create a detailed, effective prompt that will generate an abstract background image suitable for web use (e.g., social media cards).

      The user has provided the following topic for a blog post:
      - Title: "${input.title}"
      - Keywords: "${input.tags || 'modern, clean'}"

      Based on this topic, create a new prompt for an image generator. The prompt MUST adhere to the following rules:
      1.  The prompt must describe an abstract, visually appealing background graphic.
      2.  It must explicitly and strongly forbid the inclusion of any text, letters, numbers, logos, or identifiable figures. Use phrases like "text-free", "no writing", "purely graphical background".
      3.  The style should be professional, clean, and suitable for a tech blog.
      4.  The desired aspect ratio is 1.91:1 (widescreen).
      5.  The prompt should suggest colors and concepts related to the blog post topic.
      6.  Emphasize that the image should be optimized for web use with a reasonable file size.
      
      Your output should be ONLY the generated prompt, with no additional explanation or preamble.`,
      model: 'googleai/gemini-2.0-flash', // Use a fast text model for this step.
      config: { temperature: 0.5 },
    });

    const imagePrompt = promptGenerationResponse.text;
    console.log(`Generated image prompt: ${imagePrompt}`);

    // Step 2: Use the generated prompt to create the image.
    let media: { url?: string } | null | undefined;
    let lastError: unknown;

    for (const model of IMAGE_MODELS) {
      try {
        const result = await ai.generate({
          model,
          prompt: imagePrompt,
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        });
        media = result.media;
        if (media?.url) break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!media?.url) {
        throw new Error(`Image generation failed to produce a result.${lastError ? ` Last error: ${String(lastError)}` : ''}`);
    }
    
    // The model returns a data URI, which is what we need.
    return { imageUrl: media.url };
  }
);
