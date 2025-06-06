// Summarize a blog post, truncating based on content, to give readers a quick overview.
'use server';

/**
 * @fileOverview A blog post summarization AI agent.
 *
 * - summarizeBlogPost - A function that handles the blog post summarization process.
 * - SummarizeBlogPostInput - The input type for the summarizeBlogPost function.
 * - SummarizeBlogPostOutput - The return type for the summarizeBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeBlogPostInputSchema = z.object({
  blogPostContent: z
    .string()
    .describe('The full content of the blog post to be summarized.'),
});
export type SummarizeBlogPostInput = z.infer<typeof SummarizeBlogPostInputSchema>;

const SummarizeBlogPostOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the blog post content.'),
  progress: z
    .string()
    .describe('A short, one-sentence summary of what has been generated.'),
});
export type SummarizeBlogPostOutput = z.infer<typeof SummarizeBlogPostOutputSchema>;

export async function summarizeBlogPost(input: SummarizeBlogPostInput): Promise<SummarizeBlogPostOutput> {
  return summarizeBlogPostFlow(input);
}

const summarizeBlogPostPrompt = ai.definePrompt({
  name: 'summarizeBlogPostPrompt',
  input: {schema: SummarizeBlogPostInputSchema},
  output: {schema: SummarizeBlogPostOutputSchema},
  prompt: `You are an expert blog post summarizer.

  Your goal is to create a concise and informative summary of the provided blog post content.
  The summary should capture the main points and key arguments of the post, allowing readers to quickly understand the content before reading the full version.
  Truncate based on content, not just word count. Prioritize meaning over length.

  Blog Post Content: {{{blogPostContent}}}`,
});

const summarizeBlogPostFlow = ai.defineFlow(
  {
    name: 'summarizeBlogPostFlow',
    inputSchema: SummarizeBlogPostInputSchema,
    outputSchema: SummarizeBlogPostOutputSchema,
  },
  async input => {
    const {output} = await summarizeBlogPostPrompt(input);
    return {
      ...output,
      progress: 'Generated a concise summary of the blog post content.',
    } satisfies SummarizeBlogPostOutput;
  }
);
