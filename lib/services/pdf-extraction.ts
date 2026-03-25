'use client';

// Note: pdfjs-dist requires browser APIs and should only be used in the browser
// For server-side PDF extraction, use a different library like pdf-parse
// This implementation is for client-side usage

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
}

/**
 * Extract text from a PDF URL (Client-side only)
 * This should be called from the browser, not from the server
 */
export async function extractTextFromPDFUrl(
  pdfUrl: string
): Promise<PDFExtractionResult> {
  try {
    // Dynamic import to avoid loading pdfjs-dist on server during build
    const pdfjsLib = await import('pdfjs-dist');

    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return {
      text: fullText,
      pageCount: pdf.numPages,
    };
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error(
      `Failed to extract text from PDF: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * For server-side PDF extraction, use a different approach
 * This is a placeholder for when you implement server-side extraction
 */
export async function extractTextFromPDFBuffer(
  buffer: Buffer
): Promise<PDFExtractionResult> {
  try {
    // This requires installing 'pdf-parse' package for server-side usage
    // npm install pdf-parse
    // For now, returning an error as this needs separate implementation
    throw new Error('Server-side PDF extraction not yet configured');
  } catch (error) {
    console.error('Error extracting PDF text from buffer:', error);
    throw new Error(
      `Failed to extract text from PDF: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
