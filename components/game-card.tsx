"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, type KeyboardEvent, type MouseEvent } from "react";
import { formatScore, type Game } from "@/lib/games";

const BUTTON_ACCENT: Record<Game["color"], string> = {
  cyan: "",
  green: "",
  magenta: " magenta",
  yellow: " yellow",
};

export function GameCard({ game }: { game: Game }) {
  const router = useRouter();
  const tiltRef = useRef<HTMLDivElement>(null);
  const href = `/games/${game.id}`;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translateY(-6px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg)`;
  };
  const onLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") router.push(href);
  };

  return (
    <div
      ref={tiltRef}
      className="card"
      role="link"
      tabIndex={0}
      aria-label={game.title}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => router.push(href)}
      onKeyDown={onKeyDown}
    >
      <div className="cover">
        <div className={"cover-bg " + game.cover} />
        <div className="label">{game.cat}</div>
      </div>
      <div className="meta">
        <div className="title">{game.title}</div>
        <div className="desc">{game.short}</div>
        <div className="row">
          <div className="score-badge">
            <span>BEST SCORE</span>
            <b>{formatScore(game.best)}</b>
          </div>
          <Link
            href={href}
            className={"btn" + BUTTON_ACCENT[game.color]}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            PLAY
          </Link>
        </div>
      </div>
    </div>
  );
}
