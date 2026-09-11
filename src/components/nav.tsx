"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { VISIBLE_NAV_LINKS, MERCH_LINK } from "@/lib/nav";
import { SHOW_MERCH_LINK } from "@/lib/site-visibility";

const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/ZGJm8vKUbz";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav id="nav" className={scrolled ? "scrolled nav--scrolled" : undefined}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <Image src="/images/mw-logo.png" alt="Mochi Web3" width={36} height={36} priority />
            <span className="brand-word">Mochi Web3</span>
          </Link>

          {/* Dropdowns open on hover — .nav-links li:hover .nav-dropdown in chrome.css.
              Every top-level item must be an <a>: the reference styles `.nav-links a`,
              so a <span> would render unstyled at the browser default size. Groups
              without their own href point at their first child. */}
          <ul className="nav-links">
            {VISIBLE_NAV_LINKS.map((link) => {
              const href = link.href ?? link.children?.[0]?.href;
              if (!href) return null;
              return (
              <li key={link.label}>
                <Link
                  href={href}
                  className={`nav-link${link.children ? " nav-link-arrow" : ""}`}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-inner">
                      {link.children.map((child) => (
                        <Link key={child.href} href={child.href}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
              );
            })}
            {SHOW_MERCH_LINK && (
              <li>
                <a
                  href={MERCH_LINK.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link"
                >
                  {MERCH_LINK.label}
                </a>
              </li>
            )}
          </ul>

          <a href={DISCORD_URL} className="nav-cta" target="_blank" rel="noopener noreferrer">
            <span>Join Discord</span>
          </a>

          <button
            className={`burger${open ? " open" : ""}`}
            id="burger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mob-menu${open ? " open" : ""}`} id="mob-menu">
        <ul>
          {VISIBLE_NAV_LINKS.flatMap((link) =>
            link.children
              ? link.children.map((child) => (
                  <li key={child.href}>
                    <Link href={child.href} className="nav-link" onClick={() => setOpen(false)}>
                      {child.label}
                    </Link>
                  </li>
                ))
              : link.href
                ? [
                    <li key={link.href}>
                      <Link href={link.href} className="nav-link" onClick={() => setOpen(false)}>
                        {link.label}
                      </Link>
                    </li>,
                  ]
                : [],
          )}
          {SHOW_MERCH_LINK && (
            <li>
              <a
                href={MERCH_LINK.href}
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                {MERCH_LINK.label} ↗
              </a>
            </li>
          )}
          <li>
            <a
              href={DISCORD_URL}
              className="nav-link"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              Join Discord ↗
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
