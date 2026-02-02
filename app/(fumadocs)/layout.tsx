import "./global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { env } from "@/lib/env";

export const metadata: Metadata = {
	metadataBase: new URL(
		env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
	),
	title: {
		default: "Mulearn Docs",
		template: "%s | Mulearn Docs",
	},
	description: "Comprehensive documentation and guides",
	authors: [{ name: "µLearn" }],
	creator: "µLearn",
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: "Mulearn Docs",
		title: "Mulearn Docs",
		description: "Comprehensive documentation and guides",
	},
	twitter: {
		card: "summary_large_image",
		title: "Mulearn Docs",
		description: "Comprehensive documentation and guides",
	},
};

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={"flex min-h-screen flex-col"}>
				<RootProvider>{children}</RootProvider>
			</body>
		</html>
	);
}
