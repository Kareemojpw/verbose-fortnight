import { NextRequest } from 'next/server';
import { subscribeInbox } from '@/lib/events';

export async function GET(req: NextRequest) {
  const address = new URL(req.url).searchParams.get('address');
  if (!address) return new Response('Missing address', { status: 400 });

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
      const unsubscribe = subscribeInbox(address, (data) => {
        controller.enqueue(`data: ${data}\n\n`);
      });
      req.signal.addEventListener('abort', () => {
        unsubscribe();
        controller.close();
      });
    }
  });

  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } });
}
