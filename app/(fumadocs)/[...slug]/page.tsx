import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { extractTableOfContents, serializeLexical } from "@/lib/lexical-serializer";
import { source } from "@/lib/source";
import config from "@/payload.config";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const { isEnabled } = await draftMode();
  const payload = await getPayload({ config });

  let docData: any = null;

  if (isEnabled) {
    const slugs = params.slug || [];
    const lastSlug = slugs[slugs.length - 1];
    const categorySlug = slugs[0];

    const { docs } = await payload.find({
      collection: "docs",
      draft: true,
      where: {
        slug: { equals: lastSlug },
      },
      depth: 2,
    });

    // Find the doc that matches the category slug
    docData = docs.find((d: any) => {
      const catSlug = d.category && typeof d.category === "object" ? d.category.slug : null;
      return catSlug === categorySlug;
    });
  }

  const page = await source.getPage(params.slug);

  if (!page && !docData) {
    notFound();
  }

  const title = docData?.title || page?.data.title;
  const description = docData?.description || page?.data.description;
  const content = docData?.content || page?.data.content;

  const toc = extractTableOfContents(content);
  const serializedContent = await serializeLexical(content, payload);

  return (
    <DocsPage
      footer={{ enabled: true }}
      tableOfContent={{ style: "clerk", single: true }}
      toc={toc}
    >
      {isEnabled && (
        <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-400">
          <p className="flex items-center justify-between">
            <span>
              <strong>Preview Mode:</strong> You are viewing a draft version of this document.
            </span>
            <a href="/api/exit-preview" className="font-semibold underline hover:no-underline">
              Exit Preview
            </a>
          </p>
        </div>
      )}
      <DocsTitle className="font-bold font-display text-4xl md:text-5xl">{title}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      <div className="flex flex-row items-center border-b"></div>
      <DocsBody dangerouslySetInnerHTML={{ __html: serializedContent }} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return await source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = await source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const image = `/og/${[...(params.slug || []), "image.png"].join("/")}`;

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: image,
    },
    twitter: {
      card: "summary_large_image",
      images: image,
    },
  };
}

export const revalidate = 30;
