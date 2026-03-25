'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, BrainCircuit, History, FileText, ChevronRight } from 'lucide-react';
import { getAllPaperHistory, Paper } from '@/lib/db/index';
import { ThemeToggle } from '@/components/sections/theme-toggle';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [history, setHistory] = useState<Paper[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
      }
    };
    
    fetchHistory();
    setIsOpen(false); // Close menu on navigation

    window.addEventListener('history-updated', fetchHistory);
    return () => window.removeEventListener('history-updated', fetchHistory);
  }, [pathname]);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-50">ArxivDigest</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 dark:text-slate-400"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-slate-950 md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col h-full pt-20 px-6 pb-6">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                  Navigation
                </p>
                <Link
                  href="/"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-bold"
                >
                  <BrainCircuit className="w-5 h-5 text-blue-600" />
                  Dashboard
                </Link>
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-between">
                  <span>Recent Activity</span>
                  <History className="w-3 h-3" />
                </p>
                <div className="flex-1 overflow-y-auto space-y-1">
                  {history.length > 0 ? (
                    history.slice(0, 10).map((paper) => (
                      <Link
                        key={paper.id}
                        href={`/?paperId=${paper.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors group"
                      >
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate flex-1 text-sm">{paper.title}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-10">
                      No recent papers found
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                ArxivDigest Research Assistant
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
