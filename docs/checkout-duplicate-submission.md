# Checkout Duplicate Submission Prevention

## Overview
To prevent duplicate charges and multiple booking confirmation calls, the Checkout screen disables confirmation buttons and ignores additional press events once a submission is in progress or completed.

## Behavior
- Clicking 'Confirm Booking' sets `isSubmitting` to true.
- While `isSubmitting` or `isSubmitted` is true, subsequent presses are ignored.
- The button label changes to 'Processing...' during submission and 'Confirmed' after success.
