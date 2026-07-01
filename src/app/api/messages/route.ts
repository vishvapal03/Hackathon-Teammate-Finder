import { NextResponse } from 'next/server';
import { getMessages, sendMessage } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const senderId = searchParams.get('senderId');
    const receiverId = searchParams.get('receiverId');

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: 'senderId and receiverId are required' }, { status: 400 });
    }

    const sortedIds = [senderId, receiverId].sort();
    const chatId = `${sortedIds[0]}_${sortedIds[1]}`;
    const messages = getMessages(chatId);

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Messages GET Error:", error);
    return NextResponse.json({ error: 'Failed to retrieve messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { senderId, receiverId, content } = await request.json();
    if (!senderId || !receiverId || !content) {
      return NextResponse.json({ error: 'senderId, receiverId, and content are required' }, { status: 400 });
    }

    const newMessage = sendMessage(senderId, receiverId, content);
    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Messages POST Error:", error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
