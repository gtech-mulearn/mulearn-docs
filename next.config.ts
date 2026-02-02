import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import { createMDX } from "fumadocs-mdx/next";

const withMdx = createMDX();

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
};

export default withPayload(withMdx(nextConfig));
