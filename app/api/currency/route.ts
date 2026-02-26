import { NextRequest, NextResponse } from "next/server";
import {
  convertCurrency,
  getSupportedCurrencies,
  convertFromNGN,
} from "@/lib/services/currency";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, fromCurrency, toCurrency } = body;

    if (!amount || !fromCurrency || !toCurrency) {
      return NextResponse.json(
        { error: "Missing required fields: amount, fromCurrency, toCurrency" },
        { status: 400 },
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 },
      );
    }

    const result = await convertCurrency(amount, fromCurrency, toCurrency);

    return NextResponse.json({
      originalAmount: amount,
      originalCurrency: fromCurrency,
      convertedAmount: result.convertedAmount,
      targetCurrency: toCurrency,
      exchangeRate: result.rate,
      source: result.source,
    });
  } catch (error: any) {
    console.error("Error converting currency:", error);
    return NextResponse.json(
      { error: error.message || "Failed to convert currency" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const amountNGN = searchParams.get("amountNGN");
    const targetCurrency = searchParams.get("targetCurrency");

    // If specific conversion requested
    if (amountNGN && targetCurrency) {
      const amount = parseFloat(amountNGN);

      if (isNaN(amount)) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
      }

      const result = await convertFromNGN(amount, targetCurrency);

      return NextResponse.json({
        amountNGN: amount,
        targetCurrency,
        convertedAmount: result.amount,
        exchangeRate: result.rate,
        source: result.source,
      });
    }

    // Return supported currencies
    const currencies = getSupportedCurrencies();

    return NextResponse.json({
      supportedCurrencies: currencies,
    });
  } catch (error: any) {
    console.error("Error in currency API:", error);
    return NextResponse.json(
      { error: error.message || "Currency API error" },
      { status: 500 },
    );
  }
}
