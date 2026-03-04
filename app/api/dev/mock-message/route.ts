import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getProvider } from '@/lib/providers';
import { publishInbox } from '@/lib/events';

export async function POST(req: NextRequest) {
  const { address } = await req.json();
  const provider = getProvider();
  if (!provider.receiveMock) return NextResponse.json({ error: 'Mock unsupported' }, { status: 400 });
  const mocks = await provider.receiveMock(address);
  const dbAddress = await prisma.address.findUnique({ where: { email: address } });
  if (!dbAddress) return NextResponse.json({ inserted: 0 });

  for (const mock of mocks) {
    const message = await prisma.message.create({
      data: {
        addressId: dbAddress.id,
        sender: mock.sender,
        subject: mock.subject,
        preview: (mock.textBody ?? '').slice(0, 140),
        htmlBody: mock.htmlBody,
        textBody: mock.textBody,
        attachments: { create: (mock.attachments ?? []).map((a) => ({ ...a })) }
      },
      include: { attachments: true }
    });
    publishInbox(address, { type: 'new_message', message });
  }

  return NextResponse.json({ inserted: mocks.length });
}
