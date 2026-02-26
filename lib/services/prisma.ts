import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prismaInstance: PrismaClient | null = null;

function getPrismaClient() {
  // Return cached instance if already created
  if (prismaInstance) {
    return prismaInstance;
  }

  try {
    // Only try to initialize if we're in a request context (not during build)
    prismaInstance =
      global.prisma ||
      new PrismaClient({
        log: ["query", "error", "warn"],
      });

    if (process.env.NODE_ENV !== "production") {
      global.prisma = prismaInstance;
    }

    return prismaInstance;
  } catch (error) {
    console.error("Failed to initialize Prisma:", error);
    throw error;
  }
}

// Export as getter to defer initialization
export const prisma = new Proxy({} as any, {
  get: (target, prop) => {
    const client = getPrismaClient();
    return (client as any)[prop];
  },
});

export default prisma;
