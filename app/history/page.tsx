'use client';

import { useEffect, useState } from 'react';
import { getAllPaperHistory, deletePaper, Paper } from '@/lib/db/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Trash2, Download } from 'lucide-react';

export default function HistoryPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getAllPaperHistory();
        setPapers(data);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const handleDelete = async (id: string) => {
    await deletePaper(id);
    setPapers(papers.filter((p) => p.id !== id));
  };

  const handleDownload = (paper: Paper) => {
    const content = `
Title: ${paper.title}
URL: ${paper.arxivUrl}
Timestamp: ${paper.timestamp}

SUMMARY
=======

Core Contribution:
${paper.summary.coreContribution}

Methodology:
${paper.summary.methodology}

Key Results:
${paper.summary.keyResults}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paper.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 via-slate-900 to-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <History className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Paper History
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            View and manage your summarized papers
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">Loading history...</p>
          </div>
        ) : papers.length === 0 ? (
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="pt-8 pb-12 text-center">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                No Papers Yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your summarized papers will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {papers.map((paper) => (
              <Card
                key={paper.id}
                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md dark:hover:shadow-dark transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{paper.title}</CardTitle>
                      <CardDescription className="mt-2 space-y-1">
                        <div className="text-xs truncate">
                          <a
                            href={paper.arxivUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {paper.arxivUrl}
                          </a>
                        </div>
                        <div className="text-xs">
                          {new Date(paper.timestamp).toLocaleDateString()} at{' '}
                          {new Date(paper.timestamp).toLocaleTimeString()}
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleDownload(paper)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Download summary"
                      >
                        <Download className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(paper.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-50 mb-2">
                        Core Contribution
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        {paper.summary.coreContribution}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-50 mb-2">
                        Methodology
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        {paper.summary.methodology}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-50 mb-2">
                        Key Results
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        {paper.summary.keyResults}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
