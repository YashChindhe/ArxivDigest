import { NextRequest, NextResponse } from 'next/server';
import { getAllPaperHistory } from '@/lib/db/index';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const history = await getAllPaperHistory();
    return NextResponse.json(history);
  } catch (error) {
    console.error('History API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
