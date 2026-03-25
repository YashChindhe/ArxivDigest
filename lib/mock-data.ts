/**
 * Mock data for ArxivDigest - Examples that users can use
 */

export const mockPapers = [
  {
    id: 'mock-1',
    title: 'Attention Is All You Need',
    url: 'https://arxiv.org/pdf/1706.03762.pdf',
    description: 'Transformer architecture - fundamental to modern AI',
  },
  {
    id: 'mock-2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    url: 'https://arxiv.org/pdf/1810.04805.pdf',
    description: 'Large language model pre-training method',
  },
  {
    id: 'mock-3',
    title: 'Language Models are Unsupervised Multitask Learners',
    url: 'https://arxiv.org/pdf/1909.03341.pdf',
    description: 'GPT-2: Zero-shot learning capabilities',
  },
  {
    id: 'mock-4',
    title: 'An Image is Worth 16x16 Words',
    url: 'https://arxiv.org/pdf/2010.11929.pdf',
    description: 'Vision Transformer (ViT) - transformers for images',
  },
  {
    id: 'mock-5',
    title: 'Diffusion Models Beat GANs on Image Synthesis',
    url: 'https://arxiv.org/pdf/2105.05233.pdf',
    description: 'Diffusion probabilistic models for image generation',
  },
];

/**
 * Sample history entries for demonstration
 */
export const mockHistory = [
  {
    id: '1',
    title: 'Attention Is All You Need',
    arxivUrl: 'https://arxiv.org/pdf/1706.03762.pdf',
    summary: {
      coreContribution:
        'Introduced the Transformer architecture, which relies entirely on attention mechanisms instead of recurrence.',
      methodology:
        'Used multi-head self-attention layers in an encoder-decoder configuration to process sequences in parallel.',
      keyResults:
        'Achieved state-of-the-art BLEU scores on machine translation with faster training and inference than RNNs.',
    },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: '2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    arxivUrl: 'https://arxiv.org/pdf/1810.04805.pdf',
    summary: {
      coreContribution:
        'Proposed bidirectional pre-training of transformers using masked language modeling and next sentence prediction.',
      methodology:
        'Trained on large unlabeled text corpora with masked random words and sentence ordering tasks.',
      keyResults:
        'Achieved SOTA on 11 NLU tasks including question answering, sentiment analysis, and named entity recognition.',
    },
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: '3',
    title: 'An Image is Worth 16x16 Words',
    arxivUrl: 'https://arxiv.org/pdf/2010.11929.pdf',
    summary: {
      coreContribution:
        'Applied transformer architecture directly to image patches without convolutions, introducing Vision Transformer (ViT).',
      methodology:
        'Divided images into fixed-size patches, flattened them, and processed with standard transformer encoder.',
      keyResults:
        'Matched or exceeded CNN performance on image classification with fewer computational resources when pre-trained on large datasets.',
    },
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
];
