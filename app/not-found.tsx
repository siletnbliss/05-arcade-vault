import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fade-in">
      <section className="av-hero">
        <h1 className="flicker">404</h1>
        <div className="sub">
          GAME OVER · THIS CARTRIDGE IS NOT IN THE VAULT <span className="blink">_</span>
        </div>
      </section>
      <div className="pb-20 text-center">
        <Link href="/" className="btn lg">
          BACK TO VAULT
        </Link>
      </div>
    </div>
  );
}
