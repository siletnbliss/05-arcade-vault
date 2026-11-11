import { LibraryBrowser } from "@/components/library-browser";
import { GAMES } from "@/lib/games";

export default function LibraryPage() {
  return (
    <div className="fade-in">
      <section className="av-hero">
        <h1 className="flicker">ARCADE VAULT</h1>
        <div className="sub">
          INSERT A COIN TO PLAY <span className="blink">_</span>
        </div>
      </section>
      <LibraryBrowser games={GAMES} />
    </div>
  );
}
