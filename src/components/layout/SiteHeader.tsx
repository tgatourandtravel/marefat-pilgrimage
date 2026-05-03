"use client";

import Link from "next/link";
import type { Route } from "next";
import { useState, useEffect, useRef } from "react";

const navItems: { href: Route; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  return (
    <header ref={menuRef} className="sticky top-0 z-40 border-b border-charcoal/5 bg-ivory/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/logo.svg"
            alt="Marefat Pilgrimage"
            className="h-10 w-10 sm:h-11 sm:w-11"
          />
          <div className="flex flex-col">
            <span className="font-display h-4 text-sm tracking-[0.18em] uppercase text-charcoal">
              Marefat
            </span>
            <span className="text-[11px] text-charcoal/60">
              Pilgrimage
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-charcoal/75 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-charcoal"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/consultation"
            className="hidden rounded-full bg-charcoal px-4 py-2 text-xs font-medium text-ivory shadow-soft transition hover:bg-charcoal/90 md:inline-flex"
          >
            Book Consultation
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-charcoal transition hover:bg-charcoal/5 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-charcoal/5 bg-ivory/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto max-w-6xl px-6 py-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-charcoal/75 transition hover:bg-charcoal/5 hover:text-charcoal"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-charcoal/5 pt-3">
                <Link
                  href="/consultation"
                  className="flex w-full items-center justify-center rounded-full bg-charcoal px-4 py-2.5 text-sm font-medium text-ivory shadow-soft transition hover:bg-charcoal/90"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
