'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BentoGrid, BentoGridItem } from '@/components/sections/bento-grid';

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
      <div className="space-y-4">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            {title}
          </h1>
          {arxivUrl && (
            <a
              href={arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              View on arXiv
            </a>
          )}
        </div>
      )}

      <BentoGrid className="grid-cols-1 md:grid-cols-3">
        <BentoGridItem
          className="md:col-span-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800"
          title="Core Contribution"
          icon={<div className="text-2xl">💡</div>}
        >
          <CardContent className="p-0">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {summary.coreContribution}
            </p>
          </CardContent>
        </BentoGridItem>

        <BentoGridItem
          className="md:col-span-1 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800"
          title="Methodology"
          icon={<div className="text-2xl">🔬</div>}
        >
          <CardContent className="p-0">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {summary.methodology}
            </p>
          </CardContent>
        </BentoGridItem>

        <BentoGridItem
          className="md:col-span-1 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800"
          title="Key Results"
          icon={<div className="text-2xl">📊</div>}
        >
          <CardContent className="p-0">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {summary.keyResults}
            </p>
          </CardContent>
        </BentoGridItem>
      </BentoGrid>

      {summary.model && (
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Model: {summary.model}</span>
          {summary.tokensUsed && <span>Tokens Used: {summary.tokensUsed}</span>}
        </div>
      )}
    </div>
  );
};
