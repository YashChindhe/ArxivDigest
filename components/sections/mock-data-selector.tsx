'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface MockDataSelectorProps {
  onSelect: (url: string, title: string) => void;
  isLoading?: boolean;
  value?: string;
}

const mockPapers = [
  {
    title: 'Select Example Paper...',
    url: '',
    description: '',
  },
  {
    title: 'Attention Is All You Need (Transformer)',
    url: 'https://arxiv.org/pdf/1706.03762.pdf',
    description: 'Transformer architecture',
  },
  {
    title: 'BERT: Bidirectional Transformers',
    url: 'https://arxiv.org/pdf/1810.04805.pdf',
    description: 'Language model pre-training',
  },
  {
    title: 'GPT-2: Unsupervised Learners',
    url: 'https://arxiv.org/pdf/1909.03341.pdf',
    description: 'Zero-shot learning',
  },
  {
    title: 'ViT: Vision Transformer',
    url: 'https://arxiv.org/pdf/2010.11929.pdf',
    description: 'Transformers for images',
  },
];

export const MockDataSelector: React.FC<MockDataSelectorProps> = ({
  onSelect,
  isLoading,
  value,
}) => {
  return (
    <div className="space-y-3 w-full max-w-sm mx-auto">
      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">
        Quick Access (Mock Data)
      </label>
      <select
        value={value || ''}
        onChange={(e) => {
          const selected = mockPapers.find((p) => p.url === e.target.value);
          if (selected) {
            onSelect(selected.url, selected.title);
          }
        }}
        disabled={isLoading}
        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all shadow-sm"
      >
        {mockPapers.map((paper) => (
          <option key={paper.url} value={paper.url}>
            {paper.title}
          </option>
        ))}
      </select>
    </div>
  );
};
