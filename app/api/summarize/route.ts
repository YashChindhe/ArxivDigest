import { NextRequest, NextResponse } from 'next/server';
import { summarizePaper } from '@/lib/services/gemini-summarizer';
import { savePaper } from '@/lib/db/index';
import axios from 'axios';

export const maxDuration = 60; // Set function timeout to 60 seconds for longer processing

/**
 * Extract text from PDF buffer using pdf-parse (server-side)
 */
async function extractTextFromPDFBuffer(buffer: Buffer): Promise<{ text: string; pageCount: number }> {
  try {
    // Dynamic import to handle Node.js dependencies
    const pdf = require('pdf-parse');
    const data = await pdf(buffer);
    
    return {
      text: data.text,
      pageCount: data.numpages,
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract title from PDF text (heuristic)
 */
function extractPaperId(url: string): string {
  const match = url.match(/\/(\d+\.\d+)/);
  return match ? match[1] : 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const { pdfUrl, title } = await request.json();

    if (!pdfUrl) {
      return NextResponse.json(
        { error: 'PDF URL is required' },
        { status: 400 }
      );
    }

    // Validate that it's an arxiv URL or valid PDF URL
    if (
      !pdfUrl.includes('arxiv.org') &&
      !pdfUrl.includes('pdf') &&
      !pdfUrl.endsWith('.pdf')
    ) {
      return NextResponse.json(
        { error: 'Invalid PDF URL. Must be from arXiv or a direct PDF link' },
        { status: 400 }
      );
    }

    // Download PDF
    console.log('Downloading PDF from:', pdfUrl);
    const response = await axios.get(pdfUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
    });

    const pdfBuffer = Buffer.from(response.data);

    // Extract text from PDF
    console.log('Extracting text from PDF');
    const { text: pdfText, pageCount } = await extractTextFromPDFBuffer(pdfBuffer);

    if (!pdfText || pdfText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF' },
        { status: 400 }
      );
    }

    // Limit text to first 100,000 characters to stay within token limits
    const limitedText = pdfText.substring(0, 100000);

    // Generate summary using Gemini
    console.log('Generating summary with Gemini...');
    const summary = await summarizePaper(limitedText, title);

    // Save to history
    const paperId = extractPaperId(pdfUrl);
    await savePaper({
      id: `${paperId}-${Date.now()}`,
      title: title || pdfUrl,
      arxivUrl: pdfUrl,
      summary,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      summary,
      metadata: {
        pageCount,
        charactersProcessed: limitedText.length,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to process request',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'POST a request with { pdfUrl: string, title?: string }',
  });
}
