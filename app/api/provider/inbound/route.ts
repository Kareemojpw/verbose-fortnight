import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getProvider } from '@/lib/providers';
import { publishInbox } from '@/lib/events';

export async function POST(req: NextRequest) {
  const provider = getProvider();
  if (!provider.parseWebhook) return NextResponse.json({ error: 'Provider does not support webhooks' }, { status: 400 });
  const parsed = await provider.parseWebhook(await req.json());
  if (!parsed) return NextResponse.json({ accepted: false }, { status: 202 });

  const address = await prisma.address.findUnique({ where: { email: parsed.address } });
  if (!address) return NextResponse.json({ accepted: false }, { status: 202 });

  const message = await prisma.message.create({
    data: {
      addressId: address.id,
      sender: parsed.sender,
      subject: parsed.subject,
      preview: (parsed.textBody ?? parsed.htmlBody ?? '').slice(0, 140),
      htmlBody: parsed.htmlBody,
      textBody: parsed.textBody,
      attachments: { create: (parsed.attachments ?? []).map((a) => ({ ...a })) }
    },
    include: { attachments: true }
  });
  publishInbox(parsed.address, { type: 'new_message', message });
  return NextResponse.json({ accepted: true });
}
