import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@/payload.config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const collection = searchParams.get("collection");

  if (!id || !collection) {
    return new Response("No ID or collection provided", { status: 400 });
  }

  const payload = await getPayload({ config });

  let redirectUrl = "/";

  try {
    const doc = await payload.findByID({
      collection: collection as any,
      id,
      draft: true,
      depth: 5,
    });

    if (!doc) {
      return new Response("Document not found", { status: 404 });
    }

    if (collection === "docs") {
      const segments: string[] = [];
      let current: any = doc;
      while (current) {
        if (current.slug) {
          segments.unshift(current.slug);
        }
        current = current.parent;
      }

      const categorySlug =
        doc.category && typeof doc.category === "object" ? doc.category.slug : "docs";

      redirectUrl = `/${categorySlug}/${segments.join("/")}`;
    }

    (await draftMode()).enable();
  } catch (err) {
    console.error("Preview error:", err);
    return new Response("Error during preview redirect", { status: 500 });
  }

  redirect(redirectUrl);
}
