"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function refresh() {
  revalidatePath("/admin/iletisim");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function saveContact(formData: FormData) {
  const contactEmail = String(formData.get("contactEmail") ?? "").trim() || null;
  const contactPhone = String(formData.get("contactPhone") ?? "").trim() || null;
  const contactWhatsapp = String(formData.get("contactWhatsapp") ?? "").trim() || null;
  const contactLocation = String(formData.get("contactLocation") ?? "").trim() || null;

  await prisma.siteContent.upsert({
    where: { id: "main" },
    update: { contactEmail, contactPhone, contactWhatsapp, contactLocation },
    create: { id: "main", contactEmail, contactPhone, contactWhatsapp, contactLocation },
  });
  refresh();
}

function readSocial(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    icon: String(formData.get("icon") ?? "").trim(),
    href: String(formData.get("href") ?? "").trim(),
  };
}

export async function createSocial(formData: FormData) {
  const d = readSocial(formData);
  if (!d.name || !d.href) return;
  const last = await prisma.socialLink.findFirst({ orderBy: { order: "desc" } });
  await prisma.socialLink.create({ data: { ...d, order: (last?.order ?? 0) + 1 } });
  refresh();
}

export async function updateSocial(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const d = readSocial(formData);
  if (!id || !d.name || !d.href) return;
  await prisma.socialLink.update({ where: { id }, data: d });
  refresh();
}

export async function deleteSocial(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.socialLink.delete({ where: { id } });
  refresh();
}
