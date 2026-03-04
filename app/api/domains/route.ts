import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const domains = await prisma.domain.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  return NextResponse.json(domains.map((d) => d.name));
}
