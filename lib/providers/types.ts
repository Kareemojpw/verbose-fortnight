export type IncomingAttachment = {
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
};

export type IncomingMessage = {
  address: string;
  sender: string;
  subject: string;
  htmlBody?: string;
  textBody?: string;
  attachments?: IncomingAttachment[];
};

export interface EmailProvider {
  name: string;
  receiveMock?(address: string): Promise<IncomingMessage[]>;
  parseWebhook?(payload: unknown): Promise<IncomingMessage | null>;
}
