import { describe, expect, it } from 'vitest';
import { mailgunProvider } from '@/lib/providers/mailgun-provider';
import { mockProvider } from '@/lib/providers/mock-provider';

describe('provider interface', () => {
  it('parses mailgun webhook payload', async () => {
    const msg = await mailgunProvider.parseWebhook?.({ recipient: 'a@b.com', sender: 'x@y.com', subject: 'Hello', 'body-plain': 'text' });
    expect(msg?.address).toBe('a@b.com');
    expect(msg?.subject).toBe('Hello');
  });

  it('generates mock messages', async () => {
    const data = await mockProvider.receiveMock?.('tmp@example.com');
    expect(data?.[0].address).toBe('tmp@example.com');
    expect(data?.[0].attachments?.length).toBeGreaterThan(0);
  });
});
