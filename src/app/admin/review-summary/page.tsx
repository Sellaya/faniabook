'use client';

import { useActionState } from 'react';
import { handleSummarize } from './actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Lightbulb } from 'lucide-react';

const initialState = {
  summary: '',
  error: '',
};

export default function ReviewSummaryPage() {
  const [state, formAction, isPending] = useActionState(handleSummarize, initialState);

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="font-headline text-3xl">AI Review Summarizer</CardTitle>
              <CardDescription>
                Paste customer reviews below to generate a summary of common themes and feedback.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form action={formAction}>
          <CardContent>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="reviews" className="font-bold">Customer Reviews</Label>
              <Textarea
                placeholder="Paste customer reviews here, one per line."
                id="reviews"
                name="reviews"
                rows={10}
                required
                className="bg-background"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Summarizing...' : 'Generate Summary'}
            </Button>
          </CardFooter>
        </form>
        
        {(state?.summary || state?.error) && (
          <CardContent>
            <div className="mt-6">
                <h3 className="font-headline text-2xl mb-4">Summary</h3>
                {state.summary && (
                    <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>Generated Insights</AlertTitle>
                        <AlertDescription className="prose prose-sm max-w-none whitespace-pre-wrap">
                            {state.summary}
                        </AlertDescription>
                    </Alert>
                )}
                {state.error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
