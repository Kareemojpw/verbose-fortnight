import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitize } from '@/lib/sanitize';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const message = await prisma.message.findUnique({ where: { id: params.id }, include: { attachments: true } });
  if (!message) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.message.update({ where: { id: params.id }, data: { hasRead: true } });
  return NextResponse.json({ ...message, htmlBody: message.htmlBody ? sanitize(message.htmlBody) : null });
}
