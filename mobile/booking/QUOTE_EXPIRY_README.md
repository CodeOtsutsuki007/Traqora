# Quote Expiry During Checkout

When travelers proceed to checkout and passenger details, quotes are subject to an expiration timer (defaulting to 300 seconds / 5 minutes).

## Behavior
- **Normal state**: Displays the remaining time to authorize the booking.
- **Warning state**: When 60 seconds or less remain, a warning message is displayed prompting quick action.
- **Expired state**: Once the timer hits zero, an error message is shown and the authorization button is disabled to prevent stale authorization.