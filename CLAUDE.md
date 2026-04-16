# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Watch mode: compile TypeScript to main.js on every change
npm run build        # Type-check + production build (minified, no sourcemap)
npm run lint         # Run ESLint
npm version patch    # Bump patch version (updates manifest.json, versions.json, package.json)
```

There are no automated tests; testing is done by loading the plugin in Obsidian.

## Architecture

This is an Obsidian community plugin. The build pipeline is:
`src/main.ts` → esbuild bundles to `main.js` (CJS format, ES2018 target) at the repo root.

**Key constraints:**
- `obsidian`, `electron`, all CodeMirror/Lezer packages, and Node built-ins are marked external (not bundled).
- Everything else (including React) **is** bundled into `main.js`.
- `tsconfig.json` sets `"baseUrl": "src"`, so imports like `import { X } from "components/Foo"` resolve to `src/components/Foo`.
- JSX is compiled via `react-jsx` transform — `.tsx` files must be listed explicitly in `tsconfig.json`'s `include` array.

**Source layout:**
- `src/main.ts` — Plugin entry point. Registers commands, settings tab, and lifecycle hooks.
- `src/settings.ts` — `LearnSettings` interface, `DEFAULT_SETTINGS`, and `LearnSettingTab`.
- `src/LearnModal.tsx` — Obsidian `Modal` subclass; mounts a React tree into `this.contentEl` via `createRoot`.
- `src/components/ExerciseWrapper.tsx` — Root React component rendered inside the modal.

**React integration pattern:** The plugin embeds React only inside Obsidian modals/views. The modal constructor calls `createRoot(this.contentEl).render(<ExerciseWrapper />)`. All interactive UI lives in React components under `src/components/`.

**Settings:** `LearnSettings` currently holds one field: `openAIKey`. Settings are loaded in `onload` via `this.loadData()` and saved via `this.saveSettings()`.

## Coding conventions

- TypeScript strict mode is enabled (`noImplicitAny`, `strictNullChecks`, etc.) — keep it that way.
- Keep `src/main.ts` minimal: only plugin lifecycle (`onload`, `onunload`, `addCommand` calls). Delegate feature logic to separate modules.
- Split files that exceed ~200–300 lines into focused modules.
- Prefer `async/await` over promise chains.
- Use `this.registerEvent()`, `this.registerDomEvent()`, and `this.registerInterval()` for all listeners/intervals — never attach them bare, as Obsidian won't clean them up on unload.
- Avoid Node/Electron APIs to stay mobile-compatible unless `isDesktopOnly: true` is set in `manifest.json`.
- Keep startup (`onload`) light; defer heavy work until first use.

## Security & privacy

- Default to local/offline operation. Only make network requests when essential to the feature, and document them clearly.
- No hidden telemetry. Require explicit opt-in for any analytics or third-party calls.
- Never execute remote code or auto-update plugin code outside of normal releases.
- Read/write only what's necessary inside the vault; do not access files outside it.

## Release artifacts

Obsidian loads the plugin from the folder it lives in (`<Vault>/.obsidian/plugins/learn/`). The required files are `main.js`, `manifest.json`, and optionally `styles.css`. Never commit `main.js` to version control.

## Manifest rules

- Never change the plugin `id` after release.
- Keep `minAppVersion` in sync with any new Obsidian APIs used.
- When cutting a release, the GitHub release tag must exactly match `manifest.json`'s `version` (no leading `v`).
