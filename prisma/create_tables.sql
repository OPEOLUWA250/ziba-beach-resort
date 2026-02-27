-- Create User table
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  "firstName" TEXT,
  "lastName" TEXT,
  phone TEXT,
  country TEXT,
  currency TEXT NOT NULL DEFAULT 'NGN',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Room table
CREATE TABLE "Room" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  "priceNGN" DOUBLE PRECISION,
  capacity INT,
  amenities TEXT[],
  images TEXT[],
  status TEXT NOT NULL DEFAULT 'AVAILABLE',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Booking table
CREATE TABLE "Booking" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "roomId" TEXT NOT NULL,
  "checkInDate" TIMESTAMP NOT NULL,
  "checkOutDate" TIMESTAMP NOT NULL,
  "numberOfGuests" INT,
  "specialRequests" TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
  CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"(id) ON DELETE CASCADE,
  UNIQUE("roomId", "checkInDate", "checkOutDate")
);

-- Create Payment table
CREATE TABLE "Payment" (
  id TEXT PRIMARY KEY,
  "bookingId" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "amountNGN" DOUBLE PRECISION,
  "userCurrency" TEXT NOT NULL DEFAULT 'NGN',
  "userAmount" DOUBLE PRECISION,
  "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  "paystackReference" TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'PENDING',
  "paymentMethod" TEXT NOT NULL DEFAULT 'card',
  metadata JSONB,
  "receiptUrl" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON DELETE CASCADE,
  CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create Transaction table
CREATE TABLE "Transaction" (
  id TEXT PRIMARY KEY,
  "bookingId" TEXT NOT NULL,
  "paymentId" TEXT NOT NULL,
  type TEXT,
  amount DOUBLE PRECISION,
  currency TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  description TEXT,
  metadata JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Transaction_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON DELETE CASCADE,
  CONSTRAINT "Transaction_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"(id) ON DELETE CASCADE
);

-- Create Review table
CREATE TABLE "Review" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "roomId" TEXT NOT NULL,
  rating INT,
  comment TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
  CONSTRAINT "Review_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"(id) ON DELETE CASCADE
);

-- Create ExchangeRate table
CREATE TABLE "ExchangeRate" (
  id TEXT PRIMARY KEY,
  "fromCurrency" TEXT,
  "toCurrency" TEXT,
  rate DOUBLE PRECISION,
  source TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP,
  UNIQUE("fromCurrency", "toCurrency")
);

-- Create indexes for better query performance
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");
CREATE INDEX "Booking_roomId_idx" ON "Booking"("roomId");
CREATE INDEX "Booking_status_idx" ON "Booking"(status);
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");
CREATE INDEX "Payment_status_idx" ON "Payment"(status);
CREATE INDEX "Review_userId_idx" ON "Review"("userId");
CREATE INDEX "Review_roomId_idx" ON "Review"("roomId");
CREATE INDEX "ExchangeRate_fromCurrency_idx" ON "ExchangeRate"("fromCurrency");
