"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type Tab = "in" | "up";

// Visual-only auth (SPEC 01): nothing is validated or stored; every path leads back to the library.
export function AuthForm() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("in");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="av-auth-wrap fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <div className="mark" />
          <h2 className="neon-cyan">ARCADE VAULT</h2>
          <div className="mono mt-1.5 text-[11px] tracking-[0.16em] text-ink-faint">
            SYSTEM ACCESS · v2.6
          </div>
        </div>

        <div className="auth-tabs">
          <button type="button" className={tab === "in" ? "on" : undefined} onClick={() => setTab("in")}>
            SIGN IN
          </button>
          <button type="button" className={tab === "up" ? "on" : undefined} onClick={() => setTab("up")}>
            CREATE ACCOUNT
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="auth-user">Username</label>
            <input id="auth-user" value={user} onChange={(e) => setUser(e.target.value)} placeholder="px_kai" />
          </div>
          {tab === "up" && (
            <div className="field slide-in">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@vault.gg"
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="auth-pass">Password</label>
            <input
              id="auth-pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button className="btn lg mt-2 w-full" type="submit">
            {tab === "in" ? "ENTER THE VAULT" : "CREATE AND PLAY"}
          </button>
        </form>

        <button type="button" className="btn ghost mt-2.5 w-full" onClick={() => router.push("/")}>
          PLAY AS GUEST
        </button>

        <div className="auth-divider">OR CONTINUE WITH</div>
        <div className="social">
          <button className="btn ghost" type="button">
            ◆&nbsp;&nbsp;GOOGLE
          </button>
          <button className="btn ghost" type="button">
            ▣&nbsp;&nbsp;GITHUB
          </button>
        </div>

        <div className="mt-[18px] text-center text-[11px] tracking-[0.1em] text-ink-faint">
          BY ENTERING YOU ACCEPT THE ARCADE HALL TERMS
        </div>
      </div>
    </div>
  );
}
