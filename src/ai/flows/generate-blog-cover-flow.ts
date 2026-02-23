'use server';
/**
 * @fileOverview Generates a cover image for a blog post.
 *
 * - generateBlogCover - A function that creates a cover image based on a title.
 * - GenerateBlogCoverInput - The input type for the function.
 * - GenerateBlogCoverOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogCoverInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
});
export type GenerateBlogCoverInput = z.infer<typeof GenerateBlogCoverInputSchema>;

const GenerateBlogCoverOutputSchema = z.object({
  imageUrl: z.string().describe("The data URI of the generated image. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateBlogCoverOutput = z.infer<typeof GenerateBlogCoverOutputSchema>;

const IMAGE_MODELS = [
  'googleai/gemini-2.0-flash-exp-image-generation',
  ...(process.env.ENABLE_PREMIUM_IMAGE_MODEL === 'true'
    ? (['googleai/gemini-2.5-flash-image'] as const)
    : ([] as const)),
] as const;

// This is the main function that will be called from our application code.
export async function generateBlogCover(input: GenerateBlogCoverInput): Promise<GenerateBlogCoverOutput> {
  return generateBlogCoverFlow(input);
}

// Define the Genkit Flow
const generateBlogCoverFlow = ai.defineFlow(
  {
    name: 'generateBlogCoverFlow',
    inputSchema: GenerateBlogCoverInputSchema,
    outputSchema: GenerateBlogCoverOutputSchema,
  },
  async (input) => {
    console.log(`Generating cover image for: ${input.title}`);
    
    let media: { url?: string } | null | undefined;
    let lastError: unknown;

    for (const model of IMAGE_MODELS) {
      try {
        const result = await ai.generate({
          model,
          prompt: `Generate a visually appealing, high-quality blog cover image for an article titled "${input.title}". The image should be abstract or conceptual, suitable for a tech or marketing blog. Avoid text and logos. The style should be modern and clean. Aspect ratio should be 16:9.`,
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
