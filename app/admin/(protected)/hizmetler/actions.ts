"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

function refresh() {
  revalidatePath("/admin/hizmetler");
  revalidatePath("/admin");
  revalidatePath("/");
}

function readForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    icon: String(formData.get("icon") ?? "").trim() || "cube",
    color: String(formData.get("color") ?? "").trim() || "#888888",
    tools: String(formData.get("tools") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };
}

export async function createService(formData: FormData) {
  const d = readForm(formData);
  if (!d.title) return;
  const last = await prisma.service.findFirst({ orderBy: { order: "desc" } });
  await prisma.service.create({ data: { ...d, order: (last?.order ?? 0) + 1 } });
  await logActivity("Hizmet eklendi", d.title, "create");
  refresh();
}

export async function updateService(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const d = readForm(formData);
  if (!id || !d.title) return;
  await prisma.service.update({ where: { id }, data: d });
  await logActivity("Hizmet güncellendi", d.title, "update");
  refresh();
}

export async function deleteService(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const svc = await prisma.service.findUnique({ where: { id } });
  await prisma.service.delete({ where: { id } });
  await logActivity("Hizmet silindi", svc?.title, "delete");
  refresh();
}
