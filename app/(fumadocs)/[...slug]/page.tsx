import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { extractTableOfContents, serializeLexical } from "@/lib/lexical-serializer";
import { source } from "@/lib/source";
import config from "@/payload.config";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = await source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const toc = extractTableOfContents(page.data.content);
  const payload = await getPayload({ config });
  const serializedContent = await serializeLexical(page.data.content, payload);

  return (
    <DocsPage
      footer={{ enabled: true }}
      tableOfContent={{ style: "clerk", single: true }}
      toc={toc}
    >
      <DocsTitle className="font-bold font-serif text-4xl md:text-5xl">{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
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
