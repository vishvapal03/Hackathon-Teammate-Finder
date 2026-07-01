import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = getUserByEmail(email);
    
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
