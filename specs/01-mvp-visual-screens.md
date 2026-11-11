# SPEC 01 — MVP visual screens

> **Status:** Approved
> **Depends on:** None
> **Date:** 2026-11-09
> **Objective:** Port the five screens in `references/templates/` (Library, Game Detail, Player, Auth, Hall of Fame) to Next.js App Router routes with English copy and static mock data, without implementing any real game.

## Why this spec exists

The reference design is a hash-routed React 18 SPA loaded through Babel in the browser (`references/templates/*.jsx`). The styling is already ported to `app/globals.css`. This spec turns the template into real Next.js 16 routes, server and client components, and typed mock data. It is the base that later specs (real games, auth, persistence) build on.

## Scope

**In:**

- Shared chrome: top nav (logo, links, credits counter, login button, hamburger with mobile side panel) and footer, rendered from `app/layout.tsx`.
- Five routes:
  - `/` — Library: hero, search by name, category chips, game card grid with mouse tilt, empty state.
  - `/games/[id]` — Game Detail: cover, tags, description, stat strip, PLAY NOW / BACK TO VAULT, top-10 leaderboard.
  - `/games/[id]/play` — Player: HUD (player, score, lives, level), CRT arena placeholder, simulated score ticker, pause overlay, game-over modal.
  - `/login` — Auth: Sign In / Create Account tabs, fields, guest button, inert social buttons.
  - `/hall-of-fame` — Hall of Fame: per-game tabs, podium (top 3), 12-row ranking table, back button.
- Unknown game ids under `/games/[id]` and `/games/[id]/play` render the Next.js not-found page via `notFound()`.
- All UI copy translated to English, including game titles, descriptions, ids, and categories. `<html lang="en">` stays.
- Typed mock data and a deterministic score generator in `lib/games.ts`.
- Number formatting with `toLocaleString("en-US")`.
- Responsive behavior already defined in `app/globals.css` (mobile nav panel, grid breakpoints).

**Out of scope (for future specs):**

- Any real playable game. The player arena is a decorative placeholder.
- Real authentication, sessions, or user accounts.
- Any persistence: no `localStorage`, cookies, database, or API. The template's `av_user` and `av_scores` keys are not ported.
- Logged-in UI states: the nav username / sign-out button and the Hall of Fame "your best" row.
- Real leaderboards or score submission.
- Working social login (Google / GitHub buttons do nothing).
- Automated tests (Playwright or similar).
- i18n / multiple languages.

## Data model

All mock data lives in `lib/games.ts`. Shapes:

```ts
export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type NeonColor = "cyan" | "magenta" | "yellow" | "green";

export type Game = {
  id: string; // kebab-case slug, used in the URL
  title: string; // uppercase display title
  short: string; // one-line card description
  long: string; // detail-page description
  cat: Category;
  cover: string; // CSS class from globals.css, e.g. "cover-bricks"
  color: NeonColor; // accent for the card's PLAY button
  best: number; // global best score shown on card and detail
  plays: string; // preformatted, e.g. "12.4K"
};

export type ScoreRow = {
  rank: number;
  name: string;
  score: number;
  date: string;
};

export const GAMES: Game[];
export const CATS: readonly ["ALL", ...Category[]];
export function getGame(id: string): Game | undefined;
export function seededScores(seed: number, count?: number): ScoreRow[];
```

The eight games, translated from `references/templates/data.jsx`. Same order, covers, colors, `best`, and `plays`:

| Template id     | New id         | New title    | Category | Cover            |
| --------------- | -------------- | ------------ | -------- | ---------------- |
| `bloque-buster` | `block-buster` | BLOCK BUSTER | ARCADE   | `cover-bricks`   |
| `caida`         | `drop`         | DROP         | PUZZLE   | `cover-tetro`    |
| `serpentina`    | `serpentine`   | SERPENTINE   | ARCADE   | `cover-snake`    |
| `gloton`        | `glutton`      | GLUTTON      | ARCADE   | `cover-glot`     |
| `invasores`     | `invaders`     | INVADERS     | SHOOTER  | `cover-invaders` |
| `rocas`         | `rocks`        | ROCKS        | SHOOTER  | `cover-rocas`    |
| `ranaria`       | `hopper`       | HOPPER       | ARCADE   | `cover-rana`     |
| `duelo-pixel`   | `pixel-duel`   | PIXEL DUEL   | VERSUS   | `cover-duelo`    |

Conventions:

- `seededScores` keeps the template's LCG algorithm and the `PLAYERS` list, so output is deterministic for a given seed. That makes server and client rendering match.
- Seeds come from `idHash(id)`, the sum of each character code times its 1-based position: detail uses `idHash(id) * 17 + 3` (10 rows), Hall of Fame uses `idHash(id) * 23 + 7` (12 rows). The template's `id.length` formulas were dropped during implementation because ids of equal length (`serpentine` / `pixel-duel`) produced identical leaderboards.
- Dates are generated as `MM/DD/2026` (US order).
- Category filter value `"ALL"` replaces the template's `"TODOS"`.

## File layout

```
app/
  layout.tsx                 # modified: renders <Nav/>, <main className="av-main">, <Footer/>
  page.tsx                   # modified: Library (server) → <LibraryBrowser/>
  not-found.tsx              # new: themed 404
  login/page.tsx             # new: Auth → <AuthForm/>
  hall-of-fame/page.tsx      # new: → <HallOfFame/>
  games/[id]/page.tsx        # new: Game Detail (server), generateStaticParams
  games/[id]/play/page.tsx   # new: Player (server shell) → <GamePlayer/>, generateStaticParams
components/
  nav.tsx                    # "use client" (mobile panel state, active link via usePathname)
  footer.tsx                 # server
  library-browser.tsx        # "use client" (search + chips state)
  game-card.tsx              # "use client" (tilt on mouse move)
  leaderboard.tsx            # server (detail sidebar)
  game-player.tsx            # "use client" (score ticker, pause, game-over modal)
  auth-form.tsx              # "use client" (tab state, fields)
  hall-of-fame.tsx           # "use client" (selected game tab)
lib/
  games.ts                   # mock data + seededScores
```

## Implementation plan

1. **Mock data.** Create `lib/games.ts` with the types, the eight translated games, `CATS`, `getGame`, and `seededScores`. Manual check: `npm run build` compiles.
2. **Layout chrome.** Create `components/nav.tsx` and `components/footer.tsx` with English copy ("LIBRARY", "HALL OF FAME", "CREDITS · 03", "SIGN IN", footer "© 2026 ARCADE VAULT · MADE WITH PIXELS AND NEON · v2.6.0"). Use `next/link` for the links and `usePathname` for the active state. Library stays active on `/games/*`. Wire both into `app/layout.tsx` around `<main className="av-main">`. Manual check: nav and footer appear on `/`, and the hamburger opens and closes the mobile panel below the CSS breakpoint.
3. **Library.** Create `components/game-card.tsx` (tilt, category label, best score, colored PLAY button) and `components/library-browser.tsx` (search input, chips, grid, "NO RESULTS" empty state). Replace `app/page.tsx` with the hero ("ARCADE VAULT", "INSERT A COIN TO PLAY \_") and `<LibraryBrowser games={GAMES} />`. Clicking a card or PLAY navigates to `/games/[id]`. Manual check: search and chips filter, and the empty state appears for a nonsense query.
4. **Game Detail.** Create `app/games/[id]/page.tsx` with `generateStaticParams` returning all eight ids. Await `params` and call `notFound()` for unknown ids. Create `components/leaderboard.tsx` ("TOP SCORES", top-3 row classes). Tags: category, "1 PLAYER", "KEYBOARD / TOUCH", "RETRO 1985". Stat strip: "Plays", "Global best", "Difficulty". Buttons: "▶ PLAY NOW" → `/games/[id]/play`, "BACK TO VAULT" → `/`. Manual check: each of the eight detail pages renders.
5. **Not found.** Create `app/not-found.tsx` in the vault style, with a link back to `/`. Manual check: `/games/does-not-exist` shows it.
6. **Player.** Create `app/games/[id]/play/page.tsx` (same `generateStaticParams` / `notFound()` pattern) and `components/game-player.tsx`. Port the template behavior: score ticks every 220 ms, level increments, PAUSE/RESUME toggles the "PAUSED" overlay, END opens the "GAME OVER" modal, and EXIT goes to `/games/[id]`. Player name defaults to "GUEST". The modal's "SAVE SCORE" button only swaps the input for "▸ SCORE SAVED\_" and stores nothing. "PLAY AGAIN" resets state, and "BACK TO VAULT" goes to `/`. The CRT bottom bar shows "SIGNAL OK", "{TITLE} · CRT-83 · 60 HZ", and "LOAD · 1MB". Clear the interval on pause, game over, and unmount. Manual check: every state is reachable.
7. **Auth.** Create `app/login/page.tsx` and `components/auth-form.tsx`. Tabs are "SIGN IN" / "CREATE ACCOUNT", and the email field appears only on Create Account. Submit labels are "ENTER THE VAULT" / "CREATE AND PLAY". Submitting calls `preventDefault` and navigates to `/`. "PLAY AS GUEST" navigates to `/`. The "OR CONTINUE WITH" GOOGLE / GITHUB buttons are `type="button"` and do nothing. Manual check: tab switching animates the email field in.
8. **Hall of Fame.** Create `app/hall-of-fame/page.tsx` and `components/hall-of-fame.tsx`: heading "HALL OF FAME", subtitle "THE NAMES THAT NEVER LEAVE THE SCREEN", one chip per game, a podium (silver 02 / gold 01 "CHAMPION" / bronze 03), and a table with "RANK / PLAYER / SCORE / DATE" and staggered row animation. "BACK TO LIBRARY" links to `/`. There is no "your best" row. Manual check: switching tabs changes the rows.
9. **Cleanup.** Make sure no file under `app/`, `components/`, or `lib/` imports from `references/`. Make sure no Spanish UI strings remain. Run `npm run lint` and `npm run build`.

## Acceptance criteria

- [x] `npm run lint` finishes with no errors.
- [x] `npm run build` succeeds, and the eight `/games/[id]` and eight `/games/[id]/play` paths are prerendered.
- [x] `/`, `/games/[id]`, `/games/[id]/play`, `/login`, and `/hall-of-fame` render with no errors or hydration warnings in the browser console.
- [x] `/` shows 8 game cards. Typing "rock" leaves only ROCKS. Selecting SHOOTER leaves INVADERS and ROCKS. Typing "zzz" shows the "NO RESULTS" state.
- [x] Clicking a card or its PLAY button navigates to `/games/<id>`.
- [x] `/games/<id>` shows that game's title, description, stat strip, and a 10-row leaderboard. PLAY NOW goes to `/games/<id>/play`.
- [x] `/games/does-not-exist` and `/games/does-not-exist/play` show the themed not-found page.
- [x] On `/games/<id>/play` the score increases while running. PAUSE freezes it and shows the overlay, and RESUME continues it.
- [x] END opens the game-over modal with the final score. SAVE SCORE shows "SCORE SAVED\_". PLAY AGAIN resets the score to 0. BACK TO VAULT goes to `/`.
- [x] Nothing is written to `localStorage`, `sessionStorage`, or cookies on any route (checked in DevTools → Application).
- [x] `/login` toggles between the two tabs. The email field shows only on CREATE ACCOUNT. Submitting or choosing PLAY AS GUEST navigates to `/`.
- [x] `/hall-of-fame` shows a podium and 12 rows. Clicking another game chip changes the rows.
- [x] The nav highlights LIBRARY on `/` and `/games/*`, and HALL OF FAME on `/hall-of-fame`.
- [x] At a 375 px viewport the nav collapses to the hamburger, the mobile panel opens and closes, and no page scrolls horizontally.
- [x] No Spanish UI text remains in `app/`, `components/`, or `lib/`.

## Decisions

- **Yes:** real App Router routes with English paths (`/games/[id]`, `/games/[id]/play`, `/login`, `/hall-of-fame`). They give shareable URLs and room for server components. **No:** porting the hash-based single-page router. It fights the framework.
- **Yes:** English UI and English game titles and ids. It matches `lang="en"` and the existing metadata. **No:** keeping the template's Spanish copy.
- **Yes:** purely static state. There is no fake user and no `localStorage`, so the logged-in nav and the "your best" row are omitted. **No:** the template's `av_user` / `av_scores` localStorage mock, and **no** in-memory auth context. Both would be throwaway work before a real auth spec.
- **Yes:** keep the simulated player (ticking score, pause, game over). It shows every visual state of the screen without a real game. **No:** a static HUD only.
- **Yes:** SAVE SCORE gives visual confirmation only. **No:** hiding the save section. The modal layout should stay ready for a future persistence spec.
- **Yes:** `components/` and `lib/` at the repo root, imported through `@/`. **No:** `app/_components`.
- **Yes:** server components by default. `"use client"` is limited to the leaves that need state or event handlers (nav, library browser, game card, player, auth form, hall of fame).
- **Yes:** `generateStaticParams` returns all eight ids, plus `notFound()` for unknown ids. Under Cache Components it must return at least one param, and these are all known at build time.
- **Yes:** Hall of Fame tab selection in client state. **No:** a `?game=` search param. Reading `searchParams` is runtime data that would need a Suspense boundary, and it brings no benefit with mock data.
- **Yes:** deterministic `seededScores`. It avoids server/client hydration mismatches. The player's `Math.random()` runs only inside the client interval, after mount.
- **Yes:** reuse the classes already ported in `app/globals.css`. Inline styles from the template may become Tailwind utilities or stay inline, at the implementer's choice. **No:** rewriting the theme.
- **Yes:** lint, build, and a manual checklist as verification. **No:** a Playwright setup in this spec.

## Risks

| Risk                                                             | Mitigation                                                                                                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Hydration mismatch from locale formatting or random data         | Always pass an explicit `"en-US"` locale. Score generation is seeded. Random values exist only inside client effects.                      |
| A template class is missing from `app/globals.css`               | Check each screen against `references/templates/styles.css`. Port any missing rule into the `@layer components` block.                     |
| Cache Components flags uncached dynamic access in `params` pages | Ids are prerendered with `generateStaticParams`. Read the Next 16 docs in `node_modules/next/dist/docs/` before writing the dynamic pages. |
| Player interval keeps running after navigation                   | Clear it in the effect cleanup, and check that leaving the page stops the updates.                                                         |

## What is **not** in this spec

- Real games of any kind.
- Authentication, user accounts, or the logged-in UI.
- Persistence of scores or users (localStorage, DB, API).
- Real leaderboards.
- Social login.
- Automated tests.
- Internationalization.

Each one of those, if it lands, goes in its own spec.
