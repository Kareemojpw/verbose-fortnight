import { EmailProvider } from './types';

export const mockProvider: EmailProvider = {
  name: 'mock',
  async receiveMock(address: string) {
    return [
      {
        address,
        sender: 'Aurora Team <team@auroramail.io>',
        subject: 'Welcome to Aurora Mail',
        textBody: `Your disposable inbox ${address} is ready.`,
        htmlBody: `<h1>Welcome</h1><p>Your inbox <b>${address}</b> is ready.</p>`,
        attachments: [{ fileName: 'guide.pdf', mimeType: 'application/pdf', size: 200_000, url: 'https://example.com/guide.pdf' }]
      }
    ];
  }
};
