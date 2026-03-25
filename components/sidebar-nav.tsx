'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getAllPaperHistory, Paper } from '@/lib/db/index';
import { History, LayoutDashboard, Settings, FileText, Plus } from 'lucide-react';
import { ThemeToggle } from '@/components/sections/theme-toggle';

export function SidebarNav() {
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

    // Listen for manual updates
    window.addEventListener('history-updated', fetchHistory);
    return () => window.removeEventListener('history-updated', fetchHistory);
  }, [pathname]);

  const navItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            ArxivDigest
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
        <div>
          <p className="px-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            Main
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.title}
              </Link>
            );
          })}
        </div>

        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="px-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
            <span>Recent Activity</span>
            <History className="w-3 h-3" />
          </p>
          {history.length > 0 ? (
            <div className="space-y-1">
              {history.slice(0, 15).map((paper) => (
                <Link
                  key={paper.id}
                  href={`/?paperId=${paper.id}`}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group',
                    pathname.includes(paper.id)
                      ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-700 dark:hover:text-slate-200'
                  )}
                >
                  <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{paper.title}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-2 py-4 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500">No recent papers</p>
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-3 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
          <span className="text-xs font-bold text-slate-500 px-2 uppercase tracking-tight">Appearance</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
