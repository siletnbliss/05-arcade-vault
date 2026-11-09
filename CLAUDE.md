# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault is an online platform for playing games and competing for the highest score. It is built with Spec Driven Design using the `/spec` and `/spec-impl` workflow from [Klerith/fernando-skills](https://github.com/Klerith/fernando-skills), installed with `npx skills@latest add Klerith/fernando-skills`. Features should go through a spec before they are implemented.

The repo is still close to the Create Next App scaffold. `app/page.tsx` and the metadata in `app/layout.tsx` are placeholders.

## Stack and non-default config

- Next.js 16.4 (App Router only, in `app/`), React 19.3, TypeScript strict mode. The `@/*` path alias maps to the repo root.
- Read the docs in `node_modules/next/dist/docs/` (`01-app`, `03-architecture`, …) before using Next APIs. This version differs from older Next.js; for example, layouts use the global `LayoutProps<"/">` type.
- `next.config.ts` turns on `cacheComponents`, `partialPrefetching`, and `experimental.agentFeedback`. With Cache Components, data fetching and caching follow the `"use cache"` and Suspense model, not the older route segment config. Check the docs before adding dynamic data access.
- Tailwind CSS v4 runs through the `@tailwindcss/turbopack` loader, configured as a Turbopack rule for `*.css` in `next.config.ts`. It does not use PostCSS, and there is no `tailwind.config` file. Theme tokens are defined with `@theme inline` in `app/globals.css`.
- `next dev` rewrites the Next.js agent-rules block in `AGENTS.md`. Leave that block alone.
