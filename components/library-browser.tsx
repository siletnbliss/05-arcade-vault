"use client";

import { useMemo, useState } from "react";
import { GameCard } from "@/components/game-card";
import { CATS, type CategoryFilter, type Game } from "@/lib/games";

export function LibraryBrowser({ games }: { games: Game[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoryFilter>("ALL");

  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    return games.filter(
      (g) => (cat === "ALL" || g.cat === cat) && g.title.toLowerCase().includes(needle),
    );
  }, [games, q, cat]);

  return (
    <>
      <div className="av-filters">
        <div className="av-search">
          <span className="ico">⌕</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a game by name…"
            aria-label="Search games"
          />
        </div>
        <div className="av-chips">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              className={"chip" + (cat === c ? " active" : "")}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="av-grid">
        {filtered.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full p-20 text-center text-ink-faint">
            <div className="pixel mb-3 text-sm text-magenta">NO RESULTS</div>
            <div>Try another search or category.</div>
          </div>
        )}
      </div>
    </>
  );
}
