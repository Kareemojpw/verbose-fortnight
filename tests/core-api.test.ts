import { describe, expect, it } from 'vitest';
import { addressCreateSchema, inboxQuerySchema } from '@/lib/schemas';
import { checkRateLimit } from '@/lib/rate-limit';

describe('core api validation and abuse prevention', () => {
  it('validates address creation payload', () => {
    expect(addressCreateSchema.parse({ domain: 'auroramail.io' }).domain).toBe('auroramail.io');
  });

  it('validates inbox query', () => {
    const q = inboxQuerySchema.parse({ address: 'user@example.com', unread: 'true' });
    expect(q.unread).toBe('true');
  });

  it('limits burst requests', () => {
    for (let i = 0; i < 3; i++) checkRateLimit('k', 3, 1000);
    const blocked = checkRateLimit('k', 3, 1000);
    expect(blocked.ok).toBe(false);
  });
});
