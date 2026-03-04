import { mailgunProvider } from './mailgun-provider';
import { mockProvider } from './mock-provider';

export function getProvider() {
  return process.env.EMAIL_PROVIDER === 'mailgun' ? mailgunProvider : mockProvider;
}
