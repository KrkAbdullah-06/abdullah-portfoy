"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function saveAbout(formData: FormData) {
  const str = (k: string) => String(formData.get(k) ?? "").trim() || null;
  const data = {
    aboutKicker: str("aboutKicker"),
    aboutTitle: str("aboutTitle"),
    aboutBody: str("aboutBody"),
    aboutName: str("aboutName"),
    aboutSchool: str("aboutSchool"),
    aboutLoc: str("aboutLoc"),
    aboutComment1: str("aboutComment1"),
    aboutComment2: str("aboutComment2"),
    aboutComment3: str("aboutComment3"),
    aboutVision: str("aboutVision"),
    aboutStatus: str("aboutStatus"),
  };

  await prisma.siteContent.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  });

  revalidatePath("/admin/hakkimda");
  revalidatePath("/");
}
