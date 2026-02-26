import prisma from "./prisma";
import axios from "axios";

const EXCHANGE_RATE_CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const OPEN_EXCHANGE_RATES_API = "https://openexchangerates.org/api/latest.json";
const FIXER_API = "https://data.fixer.io/api/latest";

interface ExchangeRateResult {
  rate: number;
  source: string;
  currency: string;
}

/**
 * Convert amount from one currency to another
 * @param amount Amount to convert
 * @param fromCurrency Source currency (e.g., 'USD')
 * @param toCurrency Target currency (e.g., 'NGN')
 * @returns Converted amount and exchange rate used
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): Promise<{ convertedAmount: number; rate: number; source: string }> {
  if (fromCurrency === toCurrency) {
    return { convertedAmount: amount, rate: 1, source: "same" };
  }

  try {
    // Try to get cached rate from database
    const cachedRate = await prisma.exchangeRate.findUnique({
      where: {
        fromCurrency_toCurrency: { fromCurrency, toCurrency },
      },
    });

    if (cachedRate && new Date(cachedRate.expiresAt) > new Date()) {
      const convertedAmount = amount * cachedRate.rate;
      return {
        convertedAmount,
        rate: cachedRate.rate,
        source: cachedRate.source || "cached",
      };
    }

    // Fetch fresh rate from API
    const exchangeRateData = await fetchExchangeRate(fromCurrency, toCurrency);

    // Store in database if successful
    if (exchangeRateData) {
      try {
        await prisma.exchangeRate.upsert({
          where: {
            fromCurrency_toCurrency: { fromCurrency, toCurrency },
          },
          create: {
            fromCurrency,
            toCurrency,
            rate: exchangeRateData.rate,
            source: exchangeRateData.source,
            expiresAt: new Date(Date.now() + EXCHANGE_RATE_CACHE_DURATION),
          },
          update: {
            rate: exchangeRateData.rate,
            source: exchangeRateData.source,
            expiresAt: new Date(Date.now() + EXCHANGE_RATE_CACHE_DURATION),
          },
        });
      } catch (error) {
        console.error("Failed to cache exchange rate:", error);
      }

      const convertedAmount = amount * exchangeRateData.rate;
      return {
        convertedAmount,
        rate: exchangeRateData.rate,
        source: exchangeRateData.source,
      };
    }

    // If API fails and no cache, use fallback (in production, implement better fallback)
    throw new Error(
      `Could not fetch exchange rate for ${fromCurrency} to ${toCurrency}`,
    );
  } catch (error) {
    console.error("Currency conversion error:", error);
    throw error;
  }
}

/**
 * Fetch exchange rate from external APIs
 */
async function fetchExchangeRate(
  fromCurrency: string,
  toCurrency: string,
): Promise<ExchangeRateResult | null> {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  if (!apiKey) {
    console.warn("EXCHANGE_RATE_API_KEY not configured, using fallback rates");
    return getFallbackRate(fromCurrency, toCurrency);
  }

  try {
    // Try Open Exchange Rates API first
    const response = await axios.get(`${OPEN_EXCHANGE_RATES_API}`, {
      params: {
        app_id: apiKey,
        base: fromCurrency,
      },
      timeout: 5000,
    });

    if (response.data.rates && response.data.rates[toCurrency]) {
      return {
        rate: response.data.rates[toCurrency],
        source: "open-exchange-rates",
        currency: toCurrency,
      };
    }
  } catch (error) {
    console.error("Open Exchange Rates API error:", error);

    // Fallback to hardcoded rates
    return getFallbackRate(fromCurrency, toCurrency);
  }

  return null;
}

/**
 * Get hardcoded fallback exchange rates for testing
 * In production, implement a proper fallback with another API
 */
function getFallbackRate(
  fromCurrency: string,
  toCurrency: string,
): ExchangeRateResult | null {
  // Common rates (as of Feb 2026)
  const fallbackRates: Record<string, Record<string, number>> = {
    USD: {
      NGN: 1550, // 1 USD = 1550 NGN
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

/**
 * Get all supported currencies for display
 */
export function getSupportedCurrencies(): Record<string, string> {
  return {
    NGN: "Nigerian Naira",
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
  };
}

/**
 * Convert NGN to user's currency
 */
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

/**
 * Convert user's currency to NGN
 */
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
