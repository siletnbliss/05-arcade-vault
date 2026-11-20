"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Section = "library" | "hall-of-fame" | "login" | null;

function sectionFor(pathname: string): Section {
  if (pathname === "/" || pathname.startsWith("/games")) return "library";
  if (pathname.startsWith("/hall-of-fame")) return "hall-of-fame";
  if (pathname.startsWith("/login")) return "login";
  return null;
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = sectionFor(pathname);
  const cls = (s: Section) => (active === s ? "active" : undefined);
  const close = () => setOpen(false);

  return (
    <>
      <nav className="av-nav">
        <Link href="/" className="logo" onClick={close}>
          <div className="logo-mark" />
          <div className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </Link>
        <div className="links">
          <Link href="/" className={cls("library")}>
            Library
          </Link>
          <Link href="/hall-of-fame" className={cls("hall-of-fame")}>
            Hall of Fame
          </Link>
        </div>
        <div className="spacer" />
        <div className="coin-counter">
          <span className="coin" />
          <span>CREDITS · 03</span>
        </div>
        <Link href="/login" className="btn auth-btn">
          Sign In
        </Link>
        <button
          type="button"
          className="btn ghost hamburger"
          onClick={() => setOpen(true)}
          aria-label="Menu"
          aria-expanded={open}
        >
          ≡
        </button>
      </nav>

      <div className={"av-mobile-backdrop" + (open ? " open" : "")} onClick={close} />
      <aside className={"av-mobile-panel" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="pixel neon-cyan mb-4 text-[11px]">MENU</div>
        <Link href="/" className={cls("library")} onClick={close}>
          Library
        </Link>
        <Link href="/hall-of-fame" className={cls("hall-of-fame")} onClick={close}>
          Hall of Fame
        </Link>
        <Link href="/login" className={cls("login")} onClick={close}>
          Sign In
        </Link>
        <div className="flex-1" />
        <div className="pixel text-[9px] tracking-[0.16em] text-ink-faint">CREDITS · 03</div>
      </aside>
    </>
  );
}
