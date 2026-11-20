import { prisma } from '../utils/prisma';

export interface CreateBookingInput {
  userId: string;
  listingId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  idempotencyKey?: string;
}

export class BookingService {
  async createBooking(input: CreateBookingInput) {
    if (input.idempotencyKey) {
      const existing = await prisma.booking.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (existing) {
        return existing;
      }
    }

    return prisma.booking.create({
      data: {
        userId: input.userId,
        listingId: input.listingId,
        startDate: input.startDate,
        endDate: input.endDate,
        totalPrice: input.totalPrice,
        idempotencyKey: input.idempotencyKey,
      },
    });
  }
}

export const bookingService = new BookingService();
export const createBooking = bookingService.createBooking.bind(bookingService);
