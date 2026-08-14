import { prisma } from "@/lib/prisma";

// Admin işlemlerini log'a yazar (panelde "Son işlemler" olarak görünür).
// Hata olsa bile ana işlemi bozmaz (try/catch).
export async function logActivity(action: string, detail?: string | null, kind: "info" | "create" | "update" | "delete" = "info") {
  try {
    await prisma.activityLog.create({ data: { action, detail: detail ?? null, kind } });
  } catch {
    // log yazılamazsa sessizce geç
  }
}
