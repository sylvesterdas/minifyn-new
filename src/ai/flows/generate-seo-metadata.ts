'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating SEO metadata (title and description) for a given URL.
 *
 * The flow takes a URL as input and returns a title and description suitable for use as SEO metadata.
 * @file
 * - generateSeoMetadata - A function that generates SEO metadata for a given URL.
 * - GenerateSeoMetadataInput - The input type for the generateSeoMetadata function.
 * - GenerateSeoMetadataOutput - The return type for the generateSeoMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeoMetadataInputSchema = z.object({
  url: z.string().url().describe('The URL to generate SEO metadata for.'),
});
export type GenerateSeoMetadataInput = z.infer<typeof GenerateSeoMetadataInputSchema>;

const GenerateSeoMetadataOutputSchema = z.object({
  title: z.string().describe('The SEO-friendly title for the URL.'),
  description: z.string().describe('The SEO-friendly description for the URL.'),
  ogImage: z.string().url().optional().describe('The Open Graph image URL.'),
  twitterImage: z.string().url().optional().describe('The Twitter card image URL.'),
});
export type GenerateSeoMetadataOutput = z.infer<typeof GenerateSeoMetadataOutputSchema>;

export async function generateSeoMetadata(input: GenerateSeoMetadataInput): Promise<GenerateSeoMetadataOutput> {
  return generateSeoMetadataFlow(input);
}

const generateSeoMetadataPrompt = ai.definePrompt({
  name: 'generateSeoMetadataPrompt',
  input: {schema: GenerateSeoMetadataInputSchema},
  output: {schema: GenerateSeoMetadataOutputSchema},
  prompt: `You are an SEO expert. Your task is to analyze the content of the provided URL and generate a concise, engaging, and SEO-friendly title and description. You should also extract the Open Graph (og:image) and Twitter (twitter:image) image URLs if they are present. This metadata will be used for social media sharing and search engine results.

Focus on creating a compelling summary that entices users to click.

URL: {{{url}}}

Based on the content at the URL, provide the following:

- A title (max 60 characters)
- A description (max 160 characters)
- The og:image URL (if available)
- The twitter:image URL (if available)
`,
});

const generateSeoMetadataFlow = ai.defineFlow(
  {
    name: 'generateSeoMetadataFlow',
    inputSchema: GenerateSeoMetadataInputSchema,
    outputSchema: GenerateSeoMetadataOutputSchema,
  },
  async input => {
    const {output} = await generateSeoMetadataPrompt(input);
    return output!;
  }
);
