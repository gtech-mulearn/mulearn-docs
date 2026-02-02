import { withPayload } from "@payloadcms/next/withPayload";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMdx = createMDX();

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
};

export default withPayload(withMdx(nextConfig));
