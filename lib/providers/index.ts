// Developed by Karim Mohamed (@kareemoopp760)
// © 2026 Karim Mohamed. All rights reserved.

import { mailgunProvider } from './mailgun-provider';
import { mockProvider } from './mock-provider';

export function getProvider() {
  return process.env.EMAIL_PROVIDER === 'mailgun' ? mailgunProvider : mockProvider;
}
