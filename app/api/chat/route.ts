import { NextRequest, NextResponse } from 'next/server';
import { chatReply } from '@/lib/mockAi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, caseId, conversationHistory } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate AI response using chatReply
    const aiMessage = await chatReply(message, {
      caseId,
      conversationHistory,
    });

    return NextResponse.json({
      message: aiMessage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
