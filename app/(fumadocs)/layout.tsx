import "./global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "µLearn Docs",
    template: "%s | µLearn Docs",
  },
  description: "Break the echo chamber",
  authors: [{ name: "µLearn" }],
  openGraph: {
    title: "µLearn Docs",
    description:
      "µLearn is a synergic philosophy of education, with a culture of mutual learning through micro groups of peers. µLearn is here to assist you in breaking through the echo chambers and free you from the shackles that have you grounded.",
    siteName: "µLearn",
    url: "https://mulearn.org/",
    type: "website",
    images: ["/assets/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${bricolage.variable} flex min-h-screen flex-col antialiased bg-mulearn-whitish text-mulearn-blackish font-body`}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
