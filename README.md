# Pokémon — Angular + Ionic + Capacitor

A Pokédex app that runs as a desktop web app, a mobile web app, and a native
iOS/Android app from a single codebase.

- **Framework:** Angular 21 (standalone, signals, **zoneless** change detection)
- **UI / native shell:** Ionic 8 + Capacitor 8
- **Data:** [PokéAPI](https://pokeapi.co) REST
- **Persistence:** `@capacitor/preferences`
- **Tests:** Vitest

---

## Prerequisites

- **Node.js 22.12+** — Angular 21 will not run on older Node. Check with `node -v`.
  If you use [nvm](https://github.com/nvm-sh/nvm): `nvm use 22`.
- **npm** (comes with Node).
- For native builds:
  - **Android:** Android Studio + Android SDK + a **JDK 21** (Capacitor 8's Android
    project targets Java 21; JDK 17 fails with `invalid source release: 21`).
  - **iOS:** macOS with **Xcode** (Command Line Tools alone are not enough).

---

## 1. Install

```bash
npm install
```

## 2. Run in the browser (desktop + mobile web)

```bash
npm start
```

Then open **http://localhost:4200/**. The app reloads automatically on file changes.
Resize the window to see the responsive layout (grid reflows to 1–2 columns on mobile).

## 3. Production build

```bash
npm run build
```

Output goes to **`dist/pokemon/browser/`** — this folder is what Capacitor ships to
the native apps (see `webDir` in `capacitor.config.ts`).

## 4. Run the unit tests

```bash
npm test
```

Runs the Vitest suite once and exits.

---

## 5. Run as a native app (Android / iOS)

The native platforms are not committed yet — add them once, then repeat the
build → sync → open cycle whenever the web code changes.

```bash
# one-time: install the platform packages and generate the native projects
npm install -D @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios          # macOS + Xcode only

# every time you change the web app:
npm run build            # produces dist/pokemon/browser
npx cap sync             # copies the web build into the native projects

# open in the native IDE and press Run
npx cap open android     # Android Studio
npx cap open ios         # Xcode (macOS only)
```

**Gotcha — blank white screen:** the native app boots to a blank page if `webDir`
is wrong. It must point at `dist/pokemon/browser` (already set in
`capacitor.config.ts`). Verify `dist/pokemon/browser/index.html` exists after a build.

**Gotcha — Android build fails with `invalid source release: 21`:** Capacitor 8's
Android project needs **JDK 21**. Android Studio's bundled JBR may still be 17 — set
`JAVA_HOME` to a JDK 21 before building from the command line.

---

## Quick reference

| Task | Command |
|---|---|
| Install deps | `npm install` |
| Dev server (web) | `npm start` → http://localhost:4200 |
| Production build | `npm run build` → `dist/pokemon/browser` |
| Unit tests | `npm test` |
| Sync web build into native | `npm run build && npx cap sync` |
| Open Android | `npx cap open android` |
| Open iOS | `npx cap open ios` |

---
