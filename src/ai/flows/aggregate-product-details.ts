'use server';

/**
 * @fileOverview This file defines a Genkit flow for aggregating product details from various retailer websites.
 *
 * - aggregateProductDetails - A function that orchestrates the aggregation of product details.
 * - AggregateProductDetailsInput - The input type for the aggregateProductDetails function, specifying the product name to search for.
 * - AggregateProductDetailsOutput - The output type for the aggregateProductDetails function, providing the aggregated product details.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AggregateProductDetailsInputSchema = z.object({
  productName: z.string().describe('The name of the product to search for.'),
});
export type AggregateProductDetailsInput = z.infer<typeof AggregateProductDetailsInputSchema>;

const AggregateProductDetailsOutputSchema = z.object({
  details: z.string().describe('Aggregated product details from various retailer websites.'),
});
export type AggregateProductDetailsOutput = z.infer<typeof AggregateProductDetailsOutputSchema>;

export async function aggregateProductDetails(input: AggregateProductDetailsInput): Promise<AggregateProductDetailsOutput> {
  return aggregateProductDetailsFlow(input);
}

const productDetailsPrompt = ai.definePrompt({
  name: 'productDetailsPrompt',
  input: {schema: AggregateProductDetailsInputSchema},
  output: {schema: AggregateProductDetailsOutputSchema},
  prompt: `You are an expert product information aggregator.
  Your goal is to provide detailed product specifications and descriptions for the given product name by searching across various retailer websites.
  Product Name: {{{productName}}}
  Aggregate all the relevant information into a comprehensive and easy-to-understand format.
  Include key specifications, features, and descriptions that would help a user make an informed purchase decision.`,
});

const aggregateProductDetailsFlow = ai.defineFlow(
  {
    name: 'aggregateProductDetailsFlow',
    inputSchema: AggregateProductDetailsInputSchema,
    outputSchema: AggregateProductDetailsOutputSchema,
  },
  async input => {
    const {output} = await productDetailsPrompt(input);
    return output!;
  }
);
