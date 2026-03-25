'use client';

import React from 'react';
import { CardContent } from '@/components/ui/card';
import { BentoGrid, BentoGridItem } from '@/components/sections/bento-grid';
import { MathRenderer } from '@/components/sections/math-renderer';
import { BookOpen, Compass, Activity, FileText } from 'lucide-react';

interface SummaryData {
  coreContribution: string;
  methodology: string;
  keyResults: string;
  model?: string;
  tokensUsed?: number;
}

interface PaperSummaryDisplayProps {
  summary: SummaryData;
  title?: string;
  arxivUrl?: string;
  isLoading?: boolean;
}

export const PaperSummaryDisplay: React.FC<PaperSummaryDisplayProps> = ({
  summary,
  title,
  arxivUrl,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div className="md:col-span-2 h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="md:col-span-2 h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <BentoGrid className="grid-cols-1 md:grid-cols-3 auto-rows-[minmax(200px,auto)]">
        {/* Core Contribution - Main Highlight */}
        <BentoGridItem
          className="md:col-span-2 border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
          title="Core Contribution"
          icon={<BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
        >
          <div className="mt-4">
            <MathRenderer 
              content={summary.coreContribution} 
              className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-serif"
            />
          </div>
        </BentoGridItem>

        {/* Paper Link & Metadata */}
        <BentoGridItem
          className="md:col-span-1 border-2 border-blue-200/50 dark:border-blue-800/50 bg-blue-50/30 dark:bg-blue-900/10"
          title="Reference"
          icon={<FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        >
          <div className="mt-4 space-y-4">
            <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Source</p>
              <a 
                href={arxivUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 break-all underline-offset-4 hover:underline"
              >
                {arxivUrl}
              </a>
            </div>
            <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">AI Analyst</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{summary.model || 'Gemini 1.5 Flash'}</p>
            </div>
          </div>
        </BentoGridItem>

        {/* Methodology */}
        <BentoGridItem
          className="md:col-span-1 border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
          title="Methodology"
          icon={<Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        >
          <div className="mt-4">
            <MathRenderer 
              content={summary.methodology} 
              className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
            />
          </div>
        </BentoGridItem>

        {/* Key Results */}
        <BentoGridItem
          className="md:col-span-2 border-2 border-purple-200/50 dark:border-purple-800/50 bg-purple-50/10 dark:bg-purple-900/5 backdrop-blur-sm"
          title="Key Results & Findings"
          icon={<div className="text-xl">📊</div>}
        >
          <div className="mt-4">
            <MathRenderer 
              content={summary.keyResults} 
              className="text-base text-slate-800 dark:text-slate-200 leading-relaxed"
            />
          </div>
        </BentoGridItem>
      </BentoGrid>

      {summary.tokensUsed && (
        <div className="px-6 py-4 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold border-t border-slate-200/50 dark:border-slate-800/50">
          <span>Processing Efficiency: {Math.round((summary.tokensUsed / 1000000) * 100)}% of Context</span>
          <span>Tokens: {summary.tokensUsed.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};
