import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { RefreshRouteOnSave } from "@/components/RefreshRouteOnSave";
import { extractTableOfContents, serializeLexical } from "@/lib/lexical-serializer";
import { source } from "@/lib/source";
import config from "@/payload.config";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const payload = await getPayload({ config });
  const previewId = searchParams.preview_id;

  const slugs = params.slug || [];
  const lastSlug = slugs[slugs.length - 1];
  const categorySlug = slugs[0];

  let docData: any = null;

  if (previewId) {
    docData = await payload.findByID({
      collection: "docs",
      id: previewId as string,
      draft: true,
      depth: 2,
    });
  } else {
    // Fallback to slug-based lookup
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
      <RefreshRouteOnSave />
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

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const previewId = searchParams.preview_id;

  if (previewId) {
    const payload = await getPayload({ config });
    const doc = await payload.findByID({
      collection: "docs",
      id: previewId as string,
      draft: true,
      depth: 1,
    });

    if (doc) {
      return {
        title: doc.title,
        description: doc.description || undefined,
      };
    }
  }

  const page = await source.getPage(params.slug);

  if (!page) {
    return {
      title: "Not Found",
    };
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
