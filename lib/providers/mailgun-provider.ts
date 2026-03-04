import { EmailProvider } from './types';

export const mailgunProvider: EmailProvider = {
  name: 'mailgun',
  async parseWebhook(payload: any) {
    if (!payload?.recipient || !payload?.sender) return null;
    return {
      address: payload.recipient,
      sender: payload.sender,
      subject: payload.subject ?? '(No Subject)',
      htmlBody: payload['body-html'] ?? undefined,
      textBody: payload['body-plain'] ?? undefined,
      attachments: []
    };
  }
};
