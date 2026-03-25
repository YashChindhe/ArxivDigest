import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractArxivId(url: string): string {
  // Extract arXiv ID from URL
  const match = url.match(/arxiv\.org\/(?:abs|pdf)\/([0-9.]+)/)
  return match ? match[1] : ''
}

export function formatArxivUrl(arxivId: string): string {
  // Convert arXiv ID to PDF URL
  return `https://arxiv.org/pdf/${arxivId}.pdf`
}
