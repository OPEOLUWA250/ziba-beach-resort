import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prismaInstance: PrismaClient;

try {
  prismaInstance =
    global.prisma ||
    new PrismaClient({
      log: ["query", "error", "warn"],
    });

  if (process.env.NODE_ENV !== "production") {
    global.prisma = prismaInstance;
  }
} catch (error) {
  // Handle initialization errors gracefully during build
  if (process.env.NODE_ENV === "production") {
    console.error("Prisma client initialization failed:", error);
  }
  // Create a fallback instance that won't be used during build
  prismaInstance = new PrismaClient({
    log: ["error"],
  });
}

export const prisma = prismaInstance;

export default prisma;
