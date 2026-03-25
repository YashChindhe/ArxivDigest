# ArxivDigest - AI Research Paper Summarizer

A modern web application that uses AI to summarize research papers from arXiv with a clean, academic design using Bento Grid UI.

## Features

- 📄 **PDF Processing**: Extract text from arXiv PDF URLs
- 🤖 **AI Summarization**: Uses Gemini 2.5 Flash (1M token context window) to generate insightful summaries
- 📊 **Bento Grid UI**: Academic-inspired dashboard layout with color-coded summary sections
- 🔑 **Core Components**: Extracts Core Contribution, Methodology, and Key Results
- 📚 **Paper Library**: Save papers for future reference (Neon Auth integration)
- 🎨 **Modern Design**: Clean, academic aesthetic with dark mode support

## Quick Start

First, run the development server:

```bash
npm run dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to access ArxivDigest.

## Setup Instructions

### 1. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
DATABASE_URL=postgresql://user:password@host/paper-digest-db
```

### 2. Get API Keys

**Gemini API**: https://aistudio.google.com/app/apikeys

**Neon Database**: https://neon.tech

## Architecture

**Frontend**: Next.js 16, Tailwind CSS, Bento Grid UI
**Backend**: `/api/summarize` endpoint, pdfjs-dist
**AI**: Gemini 2.5 Flash (1M token context)
**Database**: Neon PostgreSQL

## Services

- `lib/services/pdf-extraction.ts` - PDF text extraction
- `lib/services/gemini-summarizer.ts` - AI summarization
- `lib/db/index.ts` - Database operations

## Usage

1. Paste arXiv PDF URL
2. Add optional title
3. Click Summarize
4. View 3-part summary: Core Contribution, Methodology, Key Results

## Tech Stack

- Next.js 16, TypeScript, Tailwind CSS
- @google/generative-ai, pdfjs-dist
- react-hook-form, zod, class-variance-authority
- @vercel/postgres (Neon)

## Node Version

Using **Node.js v18.7.0** - no updates needed to avoid breaking other projects
