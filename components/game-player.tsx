"use client";

import Link from "next/link";
import { useEffect, useReducer, useState } from "react";
import { formatScore, type Game } from "@/lib/games";

// Simulated run — no real game (SPEC 01). Score ticks up; level rises every ~2500 points.
type Run = { score: number; level: number; lives: number };
type Action = { type: "tick"; points: number } | { type: "reset" };

const INITIAL_RUN: Run = { score: 0, level: 1, lives: 3 };

function runReducer(run: Run, action: Action): Run {
  if (action.type === "reset") return INITIAL_RUN;
  const score = run.score + action.points;
  const levelUp = score % 2500 < 100;
  return { ...run, score, level: levelUp ? run.level + 1 : run.level };
}

export function GamePlayer({ game }: { game: Game }) {
  const [run, dispatch] = useReducer(runReducer, INITIAL_RUN);
  const [paused, setPaused] = useState(false);
  const [over, setOver] = useState(false);
  const [name, setName] = useState("GUEST");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (over || paused) return;
    const t = setInterval(
      () => dispatch({ type: "tick", points: Math.floor(10 + Math.random() * 90) }),
      220,
    );
    return () => clearInterval(t);
  }, [over, paused]);

  const restart = () => {
    dispatch({ type: "reset" });
    setPaused(false);
    setOver(false);
    setSaved(false);
  };

  return (
    <div className="av-player fade-in">
      <div className="player-hud">
        <div className="flex flex-wrap gap-6">
          <div className="hud-stat">
            <div className="l">Player</div>
            <div className="v text-ink">{name}</div>
          </div>
          <div className="hud-stat">
            <div className="l">Score</div>
            <div className="v">{formatScore(run.score)}</div>
          </div>
          <div className="hud-stat lives">
            <div className="l">Lives</div>
            <div className="v">{"♥ ".repeat(run.lives).trim() || "—"}</div>
          </div>
          <div className="hud-stat level">
            <div className="l">Level</div>
            <div className="v">{String(run.level).padStart(2, "0")}</div>
          </div>
        </div>
        <div className="hud-actions">
          <button type="button" className="btn yellow" onClick={() => setPaused((p) => !p)}>
            {paused ? "RESUME" : "PAUSE"}
          </button>
          <button type="button" className="btn magenta" onClick={() => setOver(true)}>
            END
          </button>
          <Link href={`/games/${game.id}`} className="btn ghost">
            EXIT
          </Link>
        </div>
      </div>

      <div className="crt">
        <div className="crt-screen">
          <div className="game-arena">
            <div className="grid-floor" />
            <div className="enemy e1" />
            <div className="enemy e2" />
            <div className="enemy e3" />
            <div className="player-ship" />
          </div>
          {paused && (
            <div className="crt-content z-[5] bg-black/60">
              <div>
                <div className="pixel neon-yellow text-[22px]">PAUSED</div>
                <div className="mono mt-2.5 text-[11px] tracking-[0.16em] text-ink-dim">
                  PRESS RESUME TO CONTINUE
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="crt-bottom">
          <span className="led">SIGNAL OK</span>
          <span>{game.title} · CRT-83 · 60 HZ</span>
          <span>LOAD · 1MB</span>
        </div>
      </div>

      {over && (
        <div className="modal-bd">
          <div className="modal" role="dialog" aria-modal="true" aria-label="Game over">
            <h2>GAME OVER</h2>
            <div className="final-label">FINAL SCORE</div>
            <div className="final">{formatScore(run.score)}</div>
            {!saved ? (
              <div className="input-row">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 10))}
                  placeholder="YOUR INITIALS"
                  aria-label="Your initials"
                />
                {/* Visual confirmation only — nothing is persisted (SPEC 01). */}
                <button type="button" className="btn yellow" onClick={() => setSaved(true)}>
                  SAVE SCORE
                </button>
              </div>
            ) : (
              <div className="toast-saved">▸ SCORE SAVED_</div>
            )}
            <div className="actions">
              <button type="button" className="btn" onClick={restart}>
                PLAY AGAIN
              </button>
              <Link href="/" className="btn magenta">
                BACK TO VAULT
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
