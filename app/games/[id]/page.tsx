import Link from "next/link";
import { notFound } from "next/navigation";
import { Leaderboard } from "@/components/leaderboard";
import { GAMES, formatScore, getGame, idHash, seededScores } from "@/lib/games";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

export default async function GameDetailPage({ params }: PageProps<"/games/[id]">) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) notFound();

  const scores = seededScores(idHash(game.id) * 17 + 3, 10);

  return (
    <div className="av-detail fade-in">
      <div>
        <div className="detail-cover">
          <div className={"cover-bg " + game.cover} />
        </div>
        <div className="detail-info mt-5">
          <div className="detail-tags">
            <span>{game.cat}</span>
            <span>1 PLAYER</span>
            <span>KEYBOARD / TOUCH</span>
            <span>RETRO 1985</span>
          </div>
          <h2 className="neon-cyan">{game.title}</h2>
          <p>{game.long}</p>
          <div className="stat-strip">
            <div>
              <div className="l">Plays</div>
              <div className="v">{game.plays}</div>
            </div>
            <div>
              <div className="l">Global best</div>
              <div className="v text-magenta [text-shadow:0_0_6px_rgba(255,0,110,0.5)]">
                {formatScore(game.best)}
              </div>
            </div>
            <div>
              <div className="l">Difficulty</div>
              <div className="v text-yellow [text-shadow:0_0_6px_rgba(245,255,0,0.5)]">
                ★ ★ ★ ☆ ☆
              </div>
            </div>
          </div>
          <div className="detail-actions">
            <Link href={`/games/${game.id}/play`} className="btn xl pulse">
              ▶&nbsp;&nbsp;PLAY NOW
            </Link>
            <Link href="/" className="btn ghost lg">
              BACK TO VAULT
            </Link>
          </div>
        </div>
      </div>

      <aside>
        <Leaderboard rows={scores} />
      </aside>
    </div>
  );
}
