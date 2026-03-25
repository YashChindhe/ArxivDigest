'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PaperSummaryDisplay } from '@/components/sections/paper-summary-display';
import { MockDataSelector } from '@/components/sections/mock-data-selector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight, BookOpen, BrainCircuit, Bookmark, Share2 } from 'lucide-react';
import { Paper } from '@/lib/db/index';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Paper[]>([]);
  const [activePaper, setActivePaper] = useState<Paper | null>(null);

  const paperId = searchParams.get('paperId');

  // Load history and check for active paper
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/history');
        if (response.ok) {
          const papers = await response.json();
          setHistory(papers);
          
          if (paperId) {
            const paper = papers.find((p: any) => p.id === paperId);
            if (paper) {
              setActivePaper(paper);
              setSummary(paper.summary);
              setPdfUrl(paper.arxivUrl);
              setTitle(paper.title);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    loadData();
  }, [paperId]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setSummary(null);
      setActivePaper(null);
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
        
        // Notify all UI parts (Sidebar, Navbar) to refresh history
        window.dispatchEvent(new Event('history-updated'));
        
        // Update local state for immediate feed
        const histResponse = await fetch('/api/history');
        if (histResponse.ok) {
          const papers = await histResponse.json();
          setHistory(papers);
          if (papers.length > 0) {
            setActivePaper(papers[0]);
          }
        }
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

  const isInitialState = !summary && !loading;

  return (
    <div className={cn(
      "px-6 lg:px-10 py-10 space-y-10 animate-in fade-in duration-700 w-full transition-all",
      isInitialState ? "min-h-[80vh] flex flex-col justify-center" : "min-h-screen"
    )}>
      {/* Hero Section / Input Area */}
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Precision Research <span className="text-blue-600">Summarization</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Extract core contributions, methodology, and key results from any ArXiv paper in seconds using advanced AI.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mt-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-slate-900 rounded-2xl sm:rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 overflow-hidden gap-2">
              <div className="hidden sm:flex pl-4 pr-2 text-slate-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <input
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="Paste ArXiv URL..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 py-3 sm:py-3 px-4 sm:px-0"
                required
              />
              <button
                type="submit"
                disabled={loading || !pdfUrl}
                className="px-6 py-3 sm:py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-xl sm:rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Analyzing
                  </span>
                ) : (
                  <>
                    Summarize
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <MockDataSelector onSelect={handleSelectMockData} isLoading={loading} value={pdfUrl} />
          </div>
        </form>
      </section>

      {/* Error Message */}
      {error && (
        <Card className="max-w-2xl mx-auto border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10 overflow-hidden">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <p className="text-sm font-bold text-red-800 dark:text-red-200">Analysis Error</p>
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Summary Section */}
      {(summary || loading) && (
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Research Synthesis Complete
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50">
                  {title || 'Current Analysis'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <PaperSummaryDisplay
              summary={summary}
              title={title}
              arxivUrl={pdfUrl}
              isLoading={loading}
            />
          </div>
        </section>
      )}

      {/* Empty State / Features */}
      {!summary && !loading && (
        <section className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto pt-10">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
             <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">$</div>
             <p className="font-bold text-slate-900 dark:text-slate-50">LaTeX Support</p>
             <p className="text-sm text-slate-500 dark:text-slate-400">High-fidelity math rendering ensures all formulas and citations in the AI output are clear and readable.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
             <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">DB</div>
             <p className="font-bold text-slate-900 dark:text-slate-50">Neon-Powered History</p>
             <p className="text-sm text-slate-500 dark:text-slate-400">Your research history is securely synced to a serverless Neon PostgreSQL database for instant access anywhere.</p>
          </div>
        </section>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-10 text-center animate-pulse">Loading Researcher...</div>}>
      <HomeContent />
    </Suspense>
  )
}
