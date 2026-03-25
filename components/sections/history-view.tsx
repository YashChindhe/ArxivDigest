'use client';

import React from 'react';
import { X, Download, Trash2 } from 'lucide-react';

interface HistoryEntry {
  id: string;
  title: string;
  arxivUrl: string;
  summary: {
    coreContribution: string;
    methodology: string;
    keyResults: string;
  };
  timestamp: string;
}

interface HistoryViewProps {
  history: HistoryEntry[];
  onClose: () => void;
  onSelectPaper: (url: string, title: string) => void;
  onDelete?: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onClose,
  onSelectPaper,
  onDelete,
}) => {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            📚 Paper History
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <p>No history yet. Start by summarizing a paper!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 cursor-pointer" onClick={() => {
                    onSelectPaper(entry.arxivUrl, entry.title);
                    onClose();
                  }}>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      {formatDate(entry.timestamp)}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {entry.summary.coreContribution}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onSelectPaper(entry.arxivUrl, entry.title);
                        onClose();
                      }}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400"
                      title="Load this paper"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(entry.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-600 dark:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
