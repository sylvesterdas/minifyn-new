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
    
    const {media} = await ai.generate({
      // IMPORTANT: ONLY this model can generate images.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      
      // We create a more descriptive prompt for the model.
      prompt: `Generate a visually appealing, abstract background image suitable for a social media share card (OG image).
      The image should be conceptual and related to the title: "${input.title}".
      Keywords for inspiration: ${input.tags || 'general, tech, modern'}.
      The style should be modern, clean, and professional. 
      IMPORTANTLY: Do not include any text, letters, numbers, logos, or recognizable figures in the image. It must be a pure background graphic.
      The image should work well with white text overlaid on top of it.
      Aspect ratio should be 1.91:1 (widescreen).
      `,
      
      config: {
        // We must request both TEXT and IMAGE for this model to work.
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
        throw new Error('Image generation failed to produce a result.');
    }
    
    // The model returns a data URI, which is what we need.
    return { imageUrl: media.url };
  }
);
