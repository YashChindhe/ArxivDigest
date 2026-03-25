import { NextRequest, NextResponse } from 'next/server';
import { summarizePaper } from '@/lib/services/gemini-summarizer';
import { savePaper, initializeDatabase } from '@/lib/db/index';
import axios from 'axios';

export const maxDuration = 60; // Set function timeout to 60 seconds for longer processing

let dbInitialized = false;

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
 * Transform ArXiv abstract URL to PDF URL
 */
function getArxivPdfUrl(url: string): string {
  if (url.includes('arxiv.org/abs/')) {
    return url.replace('arxiv.org/abs/', 'arxiv.org/pdf/') + '.pdf';
  }
  return url;
}

/**
 * Extract ArXiv ID from URL
 */
function extractPaperId(url: string): string {
  const match = url.match(/\/(\d+\.\d+)/);
  return match ? match[1] : 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    if (!dbInitialized) {
      await initializeDatabase();
      dbInitialized = true;
    }
    const { pdfUrl: rawUrl, title } = await request.json();

    if (!rawUrl) {
      return NextResponse.json(
        { error: 'PDF URL is required' },
        { status: 400 }
      );
    }

    const pdfUrl = getArxivPdfUrl(rawUrl);

    // Mock Paper Handling
    const mockUrls = [
      'https://arxiv.org/pdf/1706.03762.pdf',
      'https://arxiv.org/pdf/1810.04805.pdf',
      'https://arxiv.org/pdf/1909.03341.pdf',
      'https://arxiv.org/pdf/2010.11929.pdf'
    ];

    if (mockUrls.includes(pdfUrl)) {
      const mockSummary = {
        coreContribution: "This paper introduces the **Transformer** architecture, which relies entirely on attention mechanisms to draw global dependencies between input and output, eschewing recurrence and convolutions entirely.",
        methodology: "The authors propose the **Scaled Dot-Product Attention** and **Multi-Head Attention** mechanisms. The model follows an encoder-decoder structure where each layer contains a multi-head self-attention sub-layer followed by a position-wise fully connected feed-forward network.",
        keyResults: "The Transformer achieves state-of-the-art results on English-to-German and English-to-French translation tasks. It is also significantly faster to train than architectures based on recurrent or convolutional layers, reaching $28.4$ BLEU on WMT 2014 English-to-German."
      };

      // Save mock to DB server-side
      const paperId = extractPaperId(pdfUrl);
      await savePaper({
        id: `mock-${paperId}-${Date.now()}`,
        title: title || "Transformer Architecture",
        arxivUrl: pdfUrl,
        summary: mockSummary,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        summary: mockSummary,
        metadata: { pageCount: 15, isMock: true }
      });
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
      timeout: 45000, // Increase timeout for large PDFs
      headers: {
        'User-Agent': 'ArxivDigest/0.1.0'
      }
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

    // Limit text to stay within token limits (1M tokens is huge, 500k characters is safe)
    const limitedText = pdfText.substring(0, 500000);

    // Generate summary using Gemini
    console.log('Generating summary with Gemini...');
    const summary = await summarizePaper(limitedText, title);

    // Save to database
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
