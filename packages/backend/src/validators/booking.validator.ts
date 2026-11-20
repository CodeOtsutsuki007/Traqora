import { z } from 'zod';

export const createBookingSchema = z.object({
  userId: z.string().uuid(),
  listingId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  totalPrice: z.number().positive(),
  idempotencyKey: z.string().optional(),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;
