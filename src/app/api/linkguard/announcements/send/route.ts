import { NextRequest, NextResponse } from 'next/server';
import { messaging } from '@/lib/firebase-admin';

const ANNOUNCEMENTS_TOPIC = 'announcements';
const MAX_TITLE_LENGTH = 80;
const MAX_BODY_LENGTH = 240;

type AnnouncementPayload = {
  title?: unknown;
  body?: unknown;
  dryRun?: unknown;
};

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.LINKGUARD_BEARER_TOKEN}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  let json: AnnouncementPayload;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload.' },
      { status: 400 },
    );
  }

  const title = cleanText(json.title, MAX_TITLE_LENGTH);
  const body = cleanText(json.body, MAX_BODY_LENGTH);
  const dryRun = json.dryRun === true;

  if (!title || !body) {
    return NextResponse.json(
      { success: false, error: 'Both title and body are required.' },
      { status: 400 },
    );
  }

  const message = {
    topic: ANNOUNCEMENTS_TOPIC,
    notification: { title, body },
    data: {
      type: 'announcement',
      title,
      body,
    },
    android: {
      priority: 'normal' as const,
      notification: {
        channelId: 'daily_safety_tips_v2',
      },
    },
  };

  if (dryRun) {
    return NextResponse.json({
      success: true,
      dryRun: true,
      topic: ANNOUNCEMENTS_TOPIC,
      message,
    });
  }

  try {
    const response = await messaging.send(message);
    return NextResponse.json({
      success: true,
      dryRun: false,
      topic: ANNOUNCEMENTS_TOPIC,
      fcmResponse: response,
    });
  } catch (error: any) {
    console.error('Announcement FCM Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
