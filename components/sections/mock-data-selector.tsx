'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface MockDataSelectorProps {
  onSelect: (url: string, title: string) => void;
  isLoading?: boolean;
}

const mockPapers = [
  {
    title: 'Select an example paper...',
    url: '',
    description: '',
  },
  {
    title: 'Attention Is All You Need',
    url: 'https://arxiv.org/pdf/1706.03762.pdf',
    description: 'Transformer architecture - fundamental to modern AI',
  },
  {
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    url: 'https://arxiv.org/pdf/1810.04805.pdf',
    description: 'Large language model pre-training method',
  },
  {
    title: 'Language Models are Unsupervised Multitask Learners',
    url: 'https://arxiv.org/pdf/1909.03341.pdf',
    description: 'GPT-2: Zero-shot learning capabilities',
  },
  {
    title: 'An Image is Worth 16x16 Words (Vision Transformer)',
    url: 'https://arxiv.org/pdf/2010.11929.pdf',
    description: 'Vision Transformer (ViT) - transformers for images',
  },
  {
    title: 'Diffusion Models Beat GANs on Image Synthesis',
    url: 'https://arxiv.org/pdf/2105.05233.pdf',
    description: 'Diffusion probabilistic models for image generation',
  },
];

export const MockDataSelector: React.FC<MockDataSelectorProps> = ({
  onSelect,
  isLoading,
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-900 dark:text-slate-50">
        📖 Try Example Papers
      </label>
      <select
        onChange={(e) => {
          const selected = mockPapers.find((p) => p.url === e.target.value);
          if (selected && selected.url) {
            onSelect(selected.url, selected.title);
          }
        }}
        disabled={isLoading}
        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {mockPapers.map((paper) => (
          <option key={paper.url} value={paper.url}>
            {paper.title}
            {paper.description ? ` - ${paper.description}` : ''}
          </option>
        ))}
      </select>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Select an example to auto-fill the form, then click Summarize
      </p>
    </div>
  );
};
