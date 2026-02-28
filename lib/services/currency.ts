import axios from "axios";

const OPEN_EXCHANGE_RATES_API = "https://openexchangerates.org/api/latest.json";

interface ExchangeRateResult {
  rate: number;
  source: string;
  currency: string;
}

// Database operations removed - Supabase SDK only

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): Promise<{ convertedAmount: number; rate: number; source: string }> {
  if (fromCurrency === toCurrency) {
    return { convertedAmount: amount, rate: 1, source: "same" };
  }

  const fallbackRate = getFallbackRate(fromCurrency, toCurrency);
  if (fallbackRate) {
    return {
      convertedAmount: amount * fallbackRate.rate,
      rate: fallbackRate.rate,
      source: fallbackRate.source,
    };
  }

  return { convertedAmount: amount, rate: 1, source: "fallback-default" };
}

async function fetchExchangeRate(
  fromCurrency: string,
  toCurrency: string,
): Promise<ExchangeRateResult | null> {
  return getFallbackRate(fromCurrency, toCurrency);
}

function getFallbackRate(
  fromCurrency: string,
  toCurrency: string,
): ExchangeRateResult | null {
  const fallbackRates: Record<string, Record<string, number>> = {
    USD: {
      NGN: 1550,
      GBP: 0.78,
      EUR: 0.92,
    },
    EUR: {
      NGN: 1685,
      USD: 1.09,
      GBP: 0.84,
    },
    GBP: {
      NGN: 1845,
      USD: 1.28,
      EUR: 1.19,
    },
    NGN: {
      USD: 0.000645,
      EUR: 0.000594,
      GBP: 0.000542,
    },
  };

  const rate = fallbackRates[fromCurrency]?.[toCurrency];

  if (rate) {
    return {
      rate,
      source: "fallback",
      currency: toCurrency,
    };
  }

  return null;
}

export function getSupportedCurrencies(): Record<string, string> {
  return {
    NGN: "Nigerian Naira",
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
  };
}

export async function convertFromNGN(
  amountNGN: number,
  targetCurrency: string,
): Promise<{ amount: number; rate: number; source: string }> {
  if (targetCurrency === "NGN") {
    return { amount: amountNGN, rate: 1, source: "same" };
  }

  const result = await convertCurrency(amountNGN, "NGN", targetCurrency);
  return {
    amount: result.convertedAmount,
    rate: result.rate,
    source: result.source,
  };
}

export async function convertToNGN(
  amount: number,
  sourceCurrency: string,
): Promise<{ amountNGN: number; rate: number; source: string }> {
  if (sourceCurrency === "NGN") {
    return { amountNGN: amount, rate: 1, source: "same" };
  }

  const result = await convertCurrency(amount, sourceCurrency, "NGN");
  return {
    amountNGN: result.convertedAmount,
    rate: result.rate,
    source: result.source,
  };
}
