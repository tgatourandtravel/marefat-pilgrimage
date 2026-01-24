"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import "./globals.css";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

const navItems: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

function HeaderContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
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

  // Close menu when pressing Escape key
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
              href={item.href as any}
              className="transition hover:text-charcoal"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/consultation"
            className="hidden rounded-full bg-charcoal px-4 py-2 text-xs font-medium text-ivory shadow-soft transition hover:bg-charcoal/90 md:inline-flex"
          >
            Book Consultation
          </a>

          {/* Mobile menu button */}
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-charcoal/5 bg-ivory/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto max-w-6xl px-6 py-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href as any}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-charcoal/75 transition hover:bg-charcoal/5 hover:text-charcoal"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-charcoal/5 pt-3">
                <a
                  href="/consultation"
                  className="flex w-full items-center justify-center rounded-full bg-charcoal px-4 py-2.5 text-sm font-medium text-ivory shadow-soft transition hover:bg-charcoal/90"
                >
                  Book Consultation
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Marefat Pilgrimage – Premium Umrah, Hajj & Ziyarat Tours</title>
        <meta
          name="description"
          content="Marefat Pilgrimage offers premium, small-group Umrah, Hajj, and Ziyarat tours with handpicked hotels, guided rituals, and end‑to‑end support."
        />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="bg-ivory text-charcoal antialiased">
        <div className="flex min-h-screen flex-col">
          <HeaderContent />

          <main className="flex-1">{children}</main>

          {/* Floating WhatsApp Button */}
          <FloatingWhatsApp />

          <footer className="border-t border-charcoal/5 bg-ivory/80">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-xs text-charcoal/60 sm:px-8 sm:text-[13px] lg:px-12">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-charcoal">
                    Marefat Pilgrimage
                  </p>
                  <p className="mt-1 max-w-md">
                    Licensed religious travel agency specialized in premium
                    Umrah, Hajj, and Ziyarat experiences.
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2 text-xs sm:items-end">
                  <p className="font-medium text-charcoal/80">
                    Direct assistance
                  </p>
                  <p>Phone: +1 (950) 330-8904</p>
                  <p>Email: info@marefatpilgrimage.com</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-charcoal/5 pt-4">
                <p>© {new Date().getFullYear()} Marefat Pilgrimage. All rights reserved.</p>
                <p className="flex gap-4">
                  <span>Privacy</span>
                  <span>Terms</span>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}



