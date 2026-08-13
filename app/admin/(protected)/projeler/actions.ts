"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function readForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const year = String(formData.get("year") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const urlRaw = String(formData.get("url") ?? "").trim();
  return { title, category, year, description, url: urlRaw || null };
}

function refresh() {
  revalidatePath("/admin/projeler");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createProject(formData: FormData) {
  const d = readForm(formData);
  if (!d.title || !d.category) return;
  const last = await prisma.project.findFirst({ orderBy: { order: "desc" } });
  await prisma.project.create({ data: { ...d, order: (last?.order ?? 0) + 1 } });
  refresh();
}

export async function updateProject(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const d = readForm(formData);
  if (!id || !d.title || !d.category) return;
  await prisma.project.update({ where: { id }, data: d });
  refresh();
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.project.delete({ where: { id } });
  refresh();
}
