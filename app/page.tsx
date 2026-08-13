import { Experience } from "@/components/experience/Experience";
import { getSiteData } from "@/lib/content";

// Admin panelinden yapılan değişiklikler en geç ~30 sn içinde sitede görünür.
export const revalidate = 30;

export default async function Home() {
  const data = await getSiteData();
  return <Experience data={data} />;
}
