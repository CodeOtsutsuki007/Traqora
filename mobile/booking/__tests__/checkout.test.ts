import { validateQuoteExpiry, EXPIRY_WARNING_THRESHOLD_SECONDS, Quote } from '../checkout';

describe('validateQuoteExpiry', () => {
  const baseQuote: Quote = {
    id: 'quote-123',
    price: 500,
    expiresAt: 1000,
  };

  it('should return valid status when quote is far from expiry', () => {
    const currentTimestamp = 500; // 500 seconds remaining
    const result = validateQuoteExpiry(baseQuote, currentTimestamp);

    expect(result.isStale).toBe(false);
    expect(result.isCloseToExpiry).toBe(false);
    expect(result.remainingSeconds).toBe(500);
    expect(result.warningMessage).toBeUndefined();
  });

  it('should trigger close to expiry warning when within threshold', () => {
    const currentTimestamp = 1000 - EXPIRY_WARNING_THRESHOLD_SECONDS + 10; // 290 seconds remaining
    const result = validateQuoteExpiry(baseQuote, currentTimestamp);

    expect(result.isStale).toBe(false);
    expect(result.isCloseToExpiry).toBe(true);
    expect(result.remainingSeconds).toBe(290);
    expect(result.warningMessage).toBeDefined();
    expect(result.warningMessage).toContain('close to expiry');
  });

  it('should prevent stale authorization when quote expiry has passed', () => {
    const currentTimestamp = 1050; // 50 seconds past expiry
    const result = validateQuoteExpiry(baseQuote, currentTimestamp);

    expect(result.isStale).toBe(true);
    expect(result.isCloseToExpiry).toBe(false);
    expect(result.remainingSeconds).toBe(-50);
    expect(result.warningMessage).toBeDefined();
    expect(result.warningMessage).toContain('expired');
  });
});
