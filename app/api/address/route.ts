import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/prisma';
import { addressCreateSchema, disposeSchema } from '@/lib/schemas';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(req.headers.get('x-forwarded-for') ?? 'local', 20);
  if (!rl.ok) return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });

  const body = addressCreateSchema.parse(await req.json().catch(() => ({})));
  const domain = body.domain
    ? await prisma.domain.findUnique({ where: { name: body.domain } })
    : await prisma.domain.findFirst({ where: { isActive: true } });

  if (!domain) return NextResponse.json({ error: 'No active domain' }, { status: 400 });

  const localPart = nanoid(10).toLowerCase();
  const email = `${localPart}@${domain.name}`;
  const address = await prisma.address.create({ data: { email, localPart, domainId: domain.id }, include: { domain: true } });
  return NextResponse.json(address);
}

export async function DELETE(req: NextRequest) {
  const body = disposeSchema.parse(await req.json());
  const updated = await prisma.address.updateMany({ where: { email: body.address, disposedAt: null }, data: { disposedAt: new Date() } });
  return NextResponse.json({ disposed: updated.count > 0 });
}
