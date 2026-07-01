import { NextResponse } from 'next/server';
import { getUsers, updateUser } from '@/lib/db';

export async function GET() {
  try {
    const users = getUsers().map(({ password, ...rest }) => rest);
    return NextResponse.json(users);
  } catch (error) {
    console.error("Developers GET Error:", error);
    return NextResponse.json({ error: 'Failed to retrieve developers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id, ...data } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    const updated = updateUser(id, data);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const { password, ...safeUser } = updated;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    console.error("Developers POST Error:", error);
    return NextResponse.json({ error: 'Failed to update developer profile' }, { status: 500 });
  }
}
