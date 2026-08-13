import { prisma } from "@/lib/prisma";
import { ProjectsAdmin } from "./ProjectsAdmin";

export const dynamic = "force-dynamic";

export default async function ProjelerPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return (
    <ProjectsAdmin
      projects={projects.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        year: p.year,
        description: p.description,
        url: p.url,
      }))}
    />
  );
}
