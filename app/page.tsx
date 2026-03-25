'use client';

import { useState } from 'react';
import { PaperSummaryDisplay } from '@/components/sections/paper-summary-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryResult {
  coreContribution: string;
  methodology: string;
  keyResults: string;
  model?: string;
  tokensUsed?: number;
}

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSummary(null);
    setLoading(true);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfUrl, title }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to summarize paper');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:to-black">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ArxivDigest
          </h1>
          <p className="text-lg text-slate-300">
            AI-Powered Research Paper Summarizer
          </p>
        </div>

        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 mb-8">
          <CardHeader>
            <CardTitle>Summarize a Research Paper</CardTitle>
            <CardDescription>
              Enter an arXiv PDF URL to generate an AI-powered summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
                  PDF URL
                </label>
                <input
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://arxiv.org/pdf/2301.00000.pdf"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
                  Paper Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter paper title"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
              >
                {loading ? 'Processing...' : 'Summarize Paper'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {summary && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <PaperSummaryDisplay
              summary={summary}
              title={title || pdfUrl}
              arxivUrl={pdfUrl}
              isLoading={loading}
            />
          </div>
        )}
      </main>
    </div>
  );
}
