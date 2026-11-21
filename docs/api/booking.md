# Booking API Documentation

## Overview
The Booking contract manages flight bookings, escrow payments, cancellations, and settlements on the Stellar network using Soroban smart contracts.

## Methods

### `create_booking`
Creates a new standard booking in `pending` status.

### `create_booking_with_idempotency`
Creates a new booking idempotently using an idempotency key. If a booking has already been created with the same passenger address and non-zero `idempotency_key`, the existing booking ID is returned without duplicating records or charges.

### `pay_for_booking`
Transfers funds from the passenger to the contract escrow and transitions the booking status to `confirmed`.

### `release_payment_to_airline`
Releases escrowed funds to the airline upon successful flight completion.

### `refund_passenger`
Refunds escrowed funds back to the passenger for eligible cancellations.
