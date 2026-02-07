import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { slug?: string[] } }) {
  if (!params.slug || params.slug.length === 0) {
    redirect("/getting-started/welcome");
  }
  return null;
}
