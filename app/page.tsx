'use client';

import { useState, useEffect, useCallback } from 'react';
import { PaperSummaryDisplay } from '@/components/sections/paper-summary-display';
import { HistoryView } from '@/components/sections/history-view';
import { MockDataSelector } from '@/components/sections/mock-data-selector';
import { ThemeToggle } from '@/components/sections/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Sparkles } from 'lucide-react';
import { getAllPaperHistory, deletePaper as dbDeletePaper, Paper } from '@/lib/db/index';

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
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<Paper[]>([]);

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const papers = await getAllPaperHistory();
        setHistory(papers);
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    };
    loadHistory();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
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

        // Reload history
        const papers = await getAllPaperHistory();
        setHistory(papers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
    [pdfUrl, title]
  );

  const handleSelectMockData = (url: string, mockTitle: string) => {
    setPdfUrl(url);
    setTitle(mockTitle);
  };

  const handleSelectHistory = (url: string, historyTitle: string) => {
    setPdfUrl(url);
    setTitle(historyTitle);
  };

  const handleDeleteHistory = async (id: string) => {
    await dbDeletePaper(id);
    const papers = await getAllPaperHistory();
    setHistory(papers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-6xl">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📚 ArxivDigest
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">AI Paper Summarizer</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="View history"
            >
              <History className="w-5 h-5" />
              <span className="text-sm font-medium">{history.length}</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Input Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Summarize a Paper
                </CardTitle>
                <CardDescription>
                  Paste an arXiv PDF URL or select an example below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
                      PDF URL *
                    </label>
                    <input
                      type="url"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      placeholder="https://arxiv.org/pdf/2301.00000.pdf"
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                      placeholder="e.g., Attention Is All You Need"
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !pdfUrl}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:shadow-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span> Processing...
                      </span>
                    ) : (
                      'Summarize Paper'
                    )}
                  </button>
                </form>

                {error && (
                  <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg border border-red-300 dark:border-red-800">
                    <p className="font-medium">❌ Error</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Examples */}
          <div>
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-full">
              <CardHeader>
                <CardTitle className="text-base">Try Examples</CardTitle>
                <CardDescription>Quick start with famous papers</CardDescription>
              </CardHeader>
              <CardContent>
                <MockDataSelector onSelect={handleSelectMockData} isLoading={loading} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary Section - Bento Grid */}
        {summary && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                ✨ Summary
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                AI-generated insights for: <span className="font-medium">{title || pdfUrl}</span>
              </p>
            </div>
            <PaperSummaryDisplay
              summary={summary}
              title={title || pdfUrl}
              arxivUrl={pdfUrl}
              isLoading={loading}
            />
          </div>
        )}

        {/* Empty State */}
        {!summary && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Ready to Explore Research?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Paste an arXiv URL or pick an example to get started
            </p>
            <div className="text-sm text-slate-500 dark:text-slate-500 space-y-1">
              <p>💡 Get AI summaries in seconds</p>
              <p>📚 Build your research library</p>
              <p>🎯 Understand complex papers easily</p>
            </div>
          </div>
        )}
      </main>

      {/* History Modal */}
      {showHistory && (
        <HistoryView
          history={history}
          onClose={() => setShowHistory(false)}
          onSelectPaper={handleSelectHistory}
          onDelete={handleDeleteHistory}
        />
      )}
    </div>
  );
}
