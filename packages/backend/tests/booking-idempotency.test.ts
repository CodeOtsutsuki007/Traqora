import { createBooking } from '../src/services/booking.service';
import { createBookingSchema } from '../src/validators/booking.validator';
import { prisma } from '../src/utils/prisma';

describe('Booking Idempotency and Validation', () => {
  beforeEach(async () => {
    await prisma.booking.deleteMany({});
    await prisma.resource.deleteMany({});
  });

  it('prevents duplicate bookings and charges with the same idempotency key', async () => {
    const resource = await prisma.resource.create({
      data: {
        name: 'Test Resource',
        type: 'EQUIPMENT',
      },
    });

    const bookingData = {
      startDate: new Date(Date.now() + 3600000),
      endDate: new Date(Date.now() + 7200000),
      userId: '123e4567-e89b-12d3-a456-426614174000',
      listingId: '123e4567-e89b-12d3-a456-426614174001',
      totalPrice: 100,
      idempotencyKey: 'key-123',
    };

    const booking1 = await createBooking(bookingData);
    const booking2 = await createBooking(bookingData);

    expect(booking1.id).toEqual(booking2.id);

    const allBookings = await prisma.booking.findMany();
    expect(allBookings).toHaveLength(1);
  });

  it('fails validation for missing or invalid fields', () => {
    const invalidData = {
      userId: 'not-a-uuid',
      listingId: '123e4567-e89b-12d3-a456-426614174001',
      startDate: 'invalid-date',
      endDate: 'invalid-date',
      totalPrice: -10,
    };

    const result = createBookingSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
