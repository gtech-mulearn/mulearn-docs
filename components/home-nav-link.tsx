"use client";

import { Home } from "lucide-react";
import Link from "next/link";

export function HomeNavLink() {
  return (
    <div className="nav-link-wrapper">
      <Link
        href="/"
        className="nav__link flex items-center gap-2 px-4 py-3 no-underline text-foreground transition-all duration-200 ease-in-out"
      >
        <Home size={16} />
        <span>Home</span>
      </Link>
    </div>
  );
}
