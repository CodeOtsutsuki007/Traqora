# Booking Idempotency

## Overview
Booking creation requests support idempotency keys to ensure repeated requests with the same idempotency key do not create duplicate bookings or charges.

## Usage
Include an `idempotencyKey` field in the booking creation request payload. If a request fails or is retried with the same idempotency key, the existing booking record will be returned rather than creating a new one.
