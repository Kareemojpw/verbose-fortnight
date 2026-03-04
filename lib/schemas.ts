import { z } from 'zod';

export const emailSchema = z.string().email().max(320);

export const addressCreateSchema = z.object({
  domain: z.string().min(3).max(255).optional()
});

export const inboxQuerySchema = z.object({
  address: emailSchema,
  unread: z.enum(['true', 'false']).optional(),
  withAttachments: z.enum(['true', 'false']).optional(),
  sender: z.string().max(255).optional(),
  search: z.string().max(255).optional()
});

export const disposeSchema = z.object({
  address: emailSchema
});
