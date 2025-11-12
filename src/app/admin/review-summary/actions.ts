'use server';

import { summarizeCustomerReviews } from '@/ai/flows/summarize-customer-reviews';

type State = {
  summary: string;
  error: string;
};

export async function handleSummarize(prevState: State, formData: FormData): Promise<State> {
  const reviews = formData.get('reviews') as string;

  if (!reviews || reviews.trim().length === 0) {
    return { summary: '', error: 'Reviews input cannot be empty.' };
  }

  try {
    const result = await summarizeCustomerReviews({ reviews });
    return { summary: result.summary, error: '' };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { summary: '', error: `Failed to generate summary: ${errorMessage}` };
  }
}
