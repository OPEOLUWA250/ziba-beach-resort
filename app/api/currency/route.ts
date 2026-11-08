import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  convertCurrency,
  convertFromNGN,
  getSupportedCurrencies,
} from "@/lib/services/currency";
import { rateLimitByIp, tooManyRequests } from "@/lib/security/rate-limit";
import { BodyTooLargeError, readJsonBody } from "@/lib/server/body";

export const dynamic = "force-dynamic";

const currency = z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/);
const amount = z.number().positive().finite().max(1_000_000_000);
const conversionSchema = z.object({
  amount,
  fromCurrency: currency,
  toCurrency: currency,
});

export async function POST(request: NextRequest) {
  try {
    const rate = await rateLimitByIp(request.headers, "api:currency", 60, 60_000);
    if (!rate.allowed) return tooManyRequests(rate);

    const parsed = conversionSchema.safeParse(await readJsonBody(request, 1024));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Send amount (a positive number), fromCurrency and toCurrency (3-letter codes)" },
        { status: 400 },
      );
    }
    const { amount, fromCurrency, toCurrency } = parsed.data;

    const result = await convertCurrency(amount, fromCurrency, toCurrency);

    return NextResponse.json({
      originalAmount: amount,
      originalCurrency: fromCurrency,
      convertedAmount: result.convertedAmount,
      targetCurrency: toCurrency,
      exchangeRate: result.rate,
      source: result.source,
    });
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }
    console.error("Error converting currency:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to convert currency" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const amountNGN = searchParams.get("amountNGN");
    const targetCurrency = searchParams.get("targetCurrency");

    if (amountNGN && targetCurrency) {
      const rate = await rateLimitByIp(request.headers, "api:currency", 60, 60_000);
      if (!rate.allowed) return tooManyRequests(rate);

      const parsedAmount = amount.safeParse(Number(amountNGN));
      const parsedCurrency = currency.safeParse(targetCurrency);
      if (!parsedAmount.success || !parsedCurrency.success) {
        return NextResponse.json({ error: "Invalid amount or currency" }, { status: 400 });
      }

      const result = await convertFromNGN(parsedAmount.data, parsedCurrency.data);

      return NextResponse.json({
        amountNGN: parsedAmount.data,
        targetCurrency: parsedCurrency.data,
        convertedAmount: result.amount,
        exchangeRate: result.rate,
        source: result.source,
      });
    }

    return NextResponse.json({ supportedCurrencies: getSupportedCurrencies() });
  } catch (error) {
    console.error("Error in currency API:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Currency API error" }, { status: 500 });
  }
}
