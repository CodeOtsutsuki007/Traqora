# Booking Idempotency V1

Booking creation methods (`create_booking` in `booking` contract and `reserve_seat` in `flight_booking` contract) support an optional `idempotency_key` parameter.

## Behavior
- If a request is sent with an idempotency key that has been used previously, the contract returns the existing `booking_id` rather than creating a duplicate booking or charge.
- Repeated requests with the same idempotency key are safe and ensure exactly-once booking semantics.
