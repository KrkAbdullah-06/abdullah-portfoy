import { prisma } from "@/lib/prisma";
import { ServicesAdmin } from "./ServicesAdmin";

export const dynamic = "force-dynamic";

export default async function HizmetlerPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return (
    <ServicesAdmin
      services={services.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        icon: s.icon,
        color: s.color,
        tools: s.tools.join(", "),
      }))}
    />
  );
}
