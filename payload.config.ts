import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { searchPlugin } from "@payloadcms/plugin-search";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { databaseKVAdapter } from "payload";
import sharp from "sharp";
import { Categories } from "./collections/Categories";
import { Docs } from "./collections/Docs";
import { Media } from "./collections/Media";
import { Users } from "./collections/Users";
import "dotenv/config";
import { env } from "./lib/env";

const filenameToPath = fileURLToPath(import.meta.url);
const dirname = path.dirname(filenameToPath);

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: "µLearn Docs | CMS Admin",
      description:
        "Admin panel for documentation - Manage your documentation and content.",
      defaultOGImageType: "dynamic",
      icons: [
        {
          rel: "icon",
          type: "image/x-icon",
          url: "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          type: "image/x-icon",
          url: "/favicon.ico",
        },
      ],
      robots: "noindex, nofollow",
    },
    theme: "light",
    components: {
      afterNavLinks: ["@/components/home-nav-link#HomeNavLink"],
    },
  },
  collections: [Users, Media, Categories, Docs],
  cors: {
    origins: [env.NEXT_PUBLIC_APP_URL as string],
  },
  csrf: [env.NEXT_PUBLIC_APP_URL as string],
  db: postgresAdapter({
    pool: {
      connectionString: env.PAYLOAD_DATABASE_URI || "",
    },
  }),
  editor: lexicalEditor(),
  graphQL: {
    disable: false,
  },
  kv: databaseKVAdapter(),
  plugins: [
    searchPlugin({
      collections: ["docs"],
      defaultPriorities: {
        docs: 10,
      },
      searchOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: "description",
            type: "textarea",
            admin: {
              position: "sidebar",
            },
          },
        ],
      },
    }),
  ],
  secret: env.PAYLOAD_SECRET || "",
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
