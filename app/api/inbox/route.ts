import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { inboxQuerySchema } from '@/lib/schemas';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = inboxQuerySchema.parse(Object.fromEntries(url.searchParams.entries()));
  const address = await prisma.address.findUnique({ where: { email: query.address } });
  if (!address) return NextResponse.json([]);

  const messages = await prisma.message.findMany({
    where: {
      addressId: address.id,
      ...(query.unread === 'true' ? { hasRead: false } : {}),
      ...(query.withAttachments === 'true' ? { attachments: { some: {} } } : {}),
      ...(query.sender ? { sender: { contains: query.sender, mode: 'insensitive' } } : {}),
      ...(query.search ? { OR: [{ subject: { contains: query.search, mode: 'insensitive' } }, { preview: { contains: query.search, mode: 'insensitive' } }] } : {})
    },
    include: { attachments: true },
    orderBy: { receivedAt: 'desc' }
  });

  return NextResponse.json(messages);
}
