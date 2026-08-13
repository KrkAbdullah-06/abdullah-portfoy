import { PrismaClient } from "@prisma/client";

// Geliştirmede hot-reload'da çok sayıda bağlantı açılmasını önlemek için tekil
// (singleton) Prisma istemcisi.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
