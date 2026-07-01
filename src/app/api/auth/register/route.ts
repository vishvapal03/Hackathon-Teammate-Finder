import { NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const existing = getUserByEmail(body.email);
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    
    const newUser = createUser({
      name: body.name,
      email: body.email,
      password: body.password || 'password123',
      college: body.college || '',
      degree: body.degree || '',
      year: body.year || '1st Year',
      bio: body.bio || '',
      skills: body.skills || [],
      experience: body.experience || 'Intermediate',
      preferredRole: body.preferredRole || 'Developer',
      interests: body.interests || [],
      availability: body.availability || 'Medium (10-15 hrs/week)',
      github: body.github || '',
      linkedin: body.linkedin || '',
      portfolio: body.portfolio || '',
    });
    
    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Register API Error:", error);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}
