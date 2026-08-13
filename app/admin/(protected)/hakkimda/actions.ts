"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function saveAbout(formData: FormData) {
  const aboutKicker = String(formData.get("aboutKicker") ?? "").trim() || null;
  const aboutTitle = String(formData.get("aboutTitle") ?? "").trim() || null;
  const aboutBody = String(formData.get("aboutBody") ?? "").trim() || null;

  await prisma.siteContent.upsert({
    where: { id: "main" },
    update: { aboutKicker, aboutTitle, aboutBody },
    create: { id: "main", aboutKicker, aboutTitle, aboutBody },
  });

  revalidatePath("/admin/hakkimda");
  revalidatePath("/");
}
