import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/docs/getting-started/welcome");
}
