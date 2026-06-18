// Exchange rates base: 1 USD = X (approximate mid-market rates)
// Last updated: June 2026
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  IDR: 17847, // Indonesian Rupiah
  EUR: 0.93,  // Euro
  GBP: 0.79,  // British Pound
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  IDR: "Rp",
};

const CURRENCY_LOCALES: Record<string, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  IDR: "id-ID",
};

/**
 * Convert an amount from USD to the target currency.
 * @param amountUSD - The amount in USD
 * @param targetCurrency - Target currency code (USD, IDR, EUR, GBP)
 * @returns Converted amount in the target currency
 */
export function convertFromUSD(amountUSD: number, targetCurrency: string): number {
  const rate = EXCHANGE_RATES[targetCurrency] ?? 1;
  return amountUSD * rate;
}

/**
 * Format an amount with proper currency symbol, locale-aware formatting,
 * and automatic USD → target currency conversion.
 *
 * Examples:
 *   formatCurrency(50, "USD") -> "$50.00"
 *   formatCurrency(50, "IDR") -> "Rp892.360,00"
 *   formatCurrency(50, "EUR") -> "46,50 €"
 *   formatCurrency(58000, "IDR") -> "Rp1.035.126.000,00"
 *
 * @param amountUSD - The amount stored in USD (base currency)
 * @param targetCurrency - The target display currency
 * @returns Formatted currency string
 */
export function formatCurrency(amountUSD: number, targetCurrency: string): string {
  if (amountUSD == null || isNaN(amountUSD)) return `${getCurrencySymbol(targetCurrency)}0,00`;

  // If base USD and target is USD — just format directly
  if (targetCurrency === "USD") {
    return `$${amountUSD.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  const converted = convertFromUSD(amountUSD, targetCurrency);
  const locale = CURRENCY_LOCALES[targetCurrency] || "en-US";
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || targetCurrency;

  // Special handling for IDR (Rp symbol prefix, . thousands, , decimal)
  if (targetCurrency === "IDR") {
    const formatted = converted.toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${symbol}${formatted}`;
  }

  // EUR: space-separated format like "46,50 €"
  if (targetCurrency === "EUR") {
    const formatted = converted.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${formatted} ${symbol}`;
  }

  // GBP: £ prefix format
  if (targetCurrency === "GBP") {
    const formatted = converted.toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${symbol}${formatted}`;
  }

  // Fallback
  return `${symbol}${converted.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Get the symbol for a currency code.
 */
export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] || "$";
}

/**
 * Get the exchange rate for a currency (USD base).
 */
export function getExchangeRate(currency: string): number {
  return EXCHANGE_RATES[currency] ?? 1;
}

/**
 * Format Y-axis tick values with currency conversion and K-notation.
 */
export function formatYAxisValue(value: number, currency: string): string {
  const converted = convertFromUSD(value, currency);
  const abs = Math.abs(converted);
  const symbol = getCurrencySymbol(currency);

  if (abs >= 1_000_000) {
    return `${symbol}${(converted / 1_000_000).toFixed(1)}jt`;
  }
  if (abs >= 1_000) {
    return `${symbol}${(converted / 1_000).toFixed(0)}rb`;
  }
  return `${symbol}${converted.toFixed(0)}`;
}
