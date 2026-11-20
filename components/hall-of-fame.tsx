"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatScore, idHash, seededScores, type Game, type ScoreRow } from "@/lib/games";

const TOP_CLASS = [" top1", " top2", " top3"];

function PodiumSlot({ row, place }: { row: ScoreRow; place: "silver" | "bronze" }) {
  return (
    <div className={"podium-slot " + place}>
      <div className="rank-num">{String(row.rank).padStart(2, "0")}</div>
      <div className="name">{row.name}</div>
      <div className="score">{formatScore(row.score)}</div>
      <div className="date">{row.date}</div>
    </div>
  );
}

export function HallOfFame({ games }: { games: Game[] }) {
  const [tab, setTab] = useState(games[0].id);
  const rows = useMemo(() => seededScores(idHash(tab) * 23 + 7, 12), [tab]);
  const [first, second, third] = rows;

  return (
    <div className="av-hall fade-in">
      <div className="hall-head">
        <h1>HALL OF FAME</h1>
        <p className="pixel text-[10px]">THE NAMES THAT NEVER LEAVE THE SCREEN</p>
      </div>

      <div className="hall-tabs">
        {games.map((g) => (
          <button
            key={g.id}
            type="button"
            className={"chip" + (tab === g.id ? " active" : "")}
            onClick={() => setTab(g.id)}
          >
            {g.title}
          </button>
        ))}
      </div>

      <div className="podium">
        <PodiumSlot row={second} place="silver" />
        <div className="podium-slot gold">
          <div className="pixel text-[9px] tracking-[0.18em] text-gold">CHAMPION</div>
          <div className="rank-num mt-1 text-[36px]">01</div>
          <div className="name">{first.name}</div>
          <div className="score text-xl">{formatScore(first.score)}</div>
          <div className="date">{first.date}</div>
        </div>
        <PodiumSlot row={third} place="bronze" />
      </div>

      <div className="hall-table">
        <div className="th">
          <div>RANK</div>
          <div>PLAYER</div>
          <div>SCORE</div>
          <div>DATE</div>
        </div>
        {rows.map((r, i) => (
          <div
            key={tab + r.name}
            className={"tr" + (TOP_CLASS[i] ?? "")}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="rk">#{String(r.rank).padStart(2, "0")}</div>
            <div className="pl">{r.name}</div>
            <div className="sc">{formatScore(r.score)}</div>
            <div className="dt">{r.date}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="btn lg">
          BACK TO LIBRARY
        </Link>
      </div>
    </div>
  );
}
