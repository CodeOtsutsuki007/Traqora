# Checkout and Passenger Details

## Duplicate Checkout Submission Prevention

To prevent duplicate checkout submissions and safely handle repeated confirmation actions or network retries, the checkout screen automatically disables the submit button once a submission is in progress or completed ("Confirmed"). State management blocks concurrent or repeated press events.