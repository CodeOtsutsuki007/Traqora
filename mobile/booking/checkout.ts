export interface Quote {
  id: string;
  price: number;
  expiresAt: number; // Unix timestamp in seconds
}

export interface CheckoutValidationResult {
  isStale: boolean;
  isCloseToExpiry: boolean;
  remainingSeconds: number;
  warningMessage?: string;
}

export const EXPIRY_WARNING_THRESHOLD_SECONDS = 300; // 5 minutes

export function validateQuoteExpiry(quote: Quote, currentTimestamp: number): CheckoutValidationResult {
  const remainingSeconds = quote.expiresAt - currentTimestamp;
  const isStale = remainingSeconds <= 0;
  const isCloseToExpiry = !isStale && remainingSeconds <= EXPIRY_WARNING_THRESHOLD_SECONDS;

  let warningMessage: string | undefined;
  if (isStale) {
    warningMessage = "Quote has expired. Please fetch a fresh quote before checking out.";
  } else if (isCloseToExpiry) {
    const minutes = Math.ceil(remainingSeconds / 60);
    warningMessage = `Warning: Accepted quote is close to expiry (expires in ~${minutes} minute${minutes === 1 ? '' : 's'}).`;
  }

  return {
    isStale,
    isCloseToExpiry,
    remainingSeconds,
    warningMessage,
  };
}
