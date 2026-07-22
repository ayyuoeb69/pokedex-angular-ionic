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

Add the native platforms once (and **commit them** — see [Source control](#source-control-git)),
then repeat the build → sync → open cycle whenever the web code changes.

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

### 5a. Android → an installable APK

After `npx cap open android` opens Android Studio, **wait for the Gradle sync** (progress
bar, bottom of the window) to finish. Then pick one of two paths.

**Option A — run straight onto a device/emulator (easiest, no file to handle):**

1. Connect an Android phone with **USB debugging** enabled (Settings → *Developer
   options*), or start an emulator (*Device Manager* → ▶).
2. Choose the device in the toolbar dropdown and press **Run ▶** (`Ctrl/Cmd + R`).
3. Android Studio builds, installs, and launches the app automatically.

**Option B — produce an APK file and install it manually:**

1. Menu **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
2. When it finishes, click **locate** in the pop-up (bottom-right). The file is:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
3. Install it:
   - **Over USB:** `adb install android/app/build/outputs/apk/debug/app-debug.apk`
   - **On the phone directly:** copy the `.apk` to the device, tap it, allow *install
     from unknown sources*, then install.

**Command line only (no Android Studio needed) — same result:**

```bash
cd android
export JAVA_HOME=/path/to/jdk-21          # Capacitor 8 needs JDK 21
./gradlew assembleDebug                    # → app/build/outputs/apk/debug/app-debug.apk
adb install app/build/outputs/apk/debug/app-debug.apk   # install to a connected device
```

**Debug vs release:** the steps above build a **debug** APK — ideal for installing on
your own device to test, no signing required. A **release** APK (Play Store / wide
sharing) needs a signing key:

```bash
./gradlew assembleRelease   # requires a keystore + signingConfig in android/app/build.gradle
```

Set that up only when you are ready to distribute publicly.

### 5b. iOS → run on a simulator or device

iOS has **no APK equivalent** — you run the app from Xcode, and installing on real
devices requires Apple signing.

After `npx cap open ios` opens Xcode:

1. **Simulator (no Apple account needed):** pick a simulator (e.g. *iPhone 15*) in the
   toolbar and press **Run ▶**. It builds and launches in the simulator.
2. **A real iPhone:** connect it, then select the **App** target →
   **Signing & Capabilities** → set your **Team** (a free Apple ID works for your own
   device; the certificate lasts 7 days). Choose the device and press **Run ▶**.
3. **A shareable build (`.ipa`):** **Product → Archive**, then distribute via the
   Organizer — this needs a **paid** Apple Developer account and provisioning profiles.

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

## Source control (Git)

**Commit the native folders (`ios/` and `android/`).** This is Capacitor's recommended
setup: it lets a teammate `git clone` and build without re-running `cap add`, and it
preserves native customisation (app icons, splash, `Info.plist`, `AndroidManifest.xml`,
signing config, native plugins).

`cap add` drops a `.gitignore` **inside** each platform folder that already excludes the
regenerable/transient parts, so only real project source is committed. Ignored for you:

- `ios/App/App/public/` — the web build copied by `cap sync` (regenerated every build)
- generated config: `capacitor.config.json`, `config.xml`
- build outputs: `build/`, `DerivedData/`, `Pods/`, `.gradle/`, `xcuserdata/`, `.DS_Store`

After installing the platform packages, also commit `package.json` and
`package-lock.json`. `node_modules/` and `dist/` stay ignored by the root `.gitignore`.

> **Do not** add `/ios` or `/android` to the root `.gitignore`. Ignoring the whole native
> folder only makes sense if you never touch native code and regenerate it in CI — that
> is not Capacitor's default and it loses any customisation.

| Path | Commit? |
|---|---|
| `ios/`, `android/` (project source) | ✅ yes |
| `capacitor.config.ts` | ✅ yes |
| `package.json`, `package-lock.json` | ✅ yes |
| `node_modules/`, `dist/` | ❌ ignored (root `.gitignore`) |
| native build artifacts, copied web build, generated config | ❌ ignored (per-platform `.gitignore`) |

---
