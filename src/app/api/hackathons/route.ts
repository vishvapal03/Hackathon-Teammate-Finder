import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.hackathons);
  } catch (error) {
    console.error("Hackathons GET Error:", error);
    return NextResponse.json({ error: 'Failed to retrieve hackathons' }, { status: 500 });
  }
}
