import { NextResponse } from 'next/server';
import { getNotifications, markNotificationsRead } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const notifications = getNotifications(userId);
    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Notifications GET Error:", error);
    return NextResponse.json({ error: 'Failed to retrieve notifications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    markNotificationsRead(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications POST Error:", error);
    return NextResponse.json({ error: 'Failed to mark notifications as read' }, { status: 500 });
  }
}
