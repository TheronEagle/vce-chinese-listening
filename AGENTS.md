# AGENTS.md — Instructions for Future AI Coding Agents

> Read this file **before** touching anything. Then read `PROJECT_STATUS.md` and `TODO.md`.

---

## 1. Project Purpose

`vce-chinese-listening` is a **free VCE Chinese Second Language listening-practice web app**.
Students complete Mandarin listening exercises, answer VCE-style questions in Chinese, get
AI-assisted semantic marking, review transcripts and vocabulary, and build adaptive practice
based on weaknesses. No accounts, no payment, no backend.

**Production URL:** https://vce-chineselistening.ruttkay-gpt.workers.dev

---

## 2. Architecture (read this before changing)

| Concern | Where it lives |
|---------|----------------|
| Routes | `src/App.tsx` (5 routes) |
| State | `src/stores/practiceStore.ts`, `src/stores/statsStore.ts` (Zustand) |
| Audio | `src/services/audio.ts` — pre-generated MP3 + Web Speech fallback |
| Marking | `src/services/aiMarking.ts` — keyword + simplified semantic match |
| Adaptive | `src/services/adaptive.ts` — weakness + difficulty + speed recommendation |
| Exercise data | `src/data/sample-exercises.ts` (aggregates 18 from 5 files) |
| Types | `src/types/index.ts` |
| Audio source | `public/audio/ex-XXX/line-NN.mp3` + `full.mp3` (edge-tts generated) |

**There is no backend, no DB, no Workers, no KV.** Everything is client-side.

---

## 3. Development Commands

```bash
npm install                 # install deps (first time only)
npm run dev                 # vite dev server on http://localhost:5173
npm run build               # tsc -b && vite build → dist/
npm run preview             # serve dist/ locally
npm run lint                # oxlint
```

---

## 4. Test Commands

**There are no unit tests yet.** See TODO.md P2 for the backlog. When you add tests:

```bash
# Suggested: Vitest (not yet installed)
npx vitest                  # run all tests
npx vitest --coverage       # with coverage
```

Before every commit, at minimum:

```bash
npm run build               # MUST pass — catches type errors
```

---

## 5. Deployment Commands

This project auto-deploys to Cloudflare Pages on push to `main`. **No manual deploy needed.**

If you ever need to deploy manually:

```bash
npm run build
npx wrangler pages deploy dist --project-name=vce-chineselistening
```

The `wrangler.toml` is already configured (`assets.directory = "./dist"`,
`name = "vce-chineselistening"`).

---

## 6. Repository Rules (DO)

- ✅ **Inspect before modifying.** Read the existing file, understand why it is the way it is,
  then change only what is needed.
- ✅ **One commit per logical change.** Conventional prefixes: `feat:`, `fix:`, `chore:`,
  `docs:`, `refactor:`, `test:`.
- ✅ **Run `npm run build` before committing.** Catches type errors.
- ✅ **Verify on production** after pushing: `curl -I https://vce-chineselistening.ruttkay-gpt.workers.dev/...`
- ✅ **Update PROJECT_STATUS.md and TODO.md** at the end of every meaningful session.
- ✅ **Add to CHANGELOG.md** for every user-facing change.
- ✅ **Keep audio committed to git** unless repo size becomes a problem. Current size 8.4 MB is fine.

---

## 7. Repository Rules (DO NOT)

- ❌ **Do not rewrite working code** just because you'd prefer a different implementation.
- ❌ **Do not delete existing audio.** Audio is valuable project asset. Only delete specific
  files when you are intentionally replacing them with verified-correct new audio.
- ❌ **Do not regenerate all audio.** Only regenerate the specific broken ones (see PROJECT_STATUS BUG-001).
- ❌ **Do not introduce a backend, DB, accounts, or payments.** The product is intentionally free + local.
- ❌ **Do not commit secrets, .env files, API keys, GitHub tokens, or Cloudflare tokens.**
  Use Cloudflare Pages' own env-var UI for any future secrets.
- ❌ **Do not commit `node_modules/`, `dist/`, or `.DS_Store`** (already in `.gitignore`).
- ❌ **Do not commit `package-lock.json` changes** unless you actually changed `package.json`.
- ❌ **Do not make a giant monolithic commit.** Split logically.
- ❌ **Do not write unrelated schoolwork** (essays, exam papers, study guides for Corey's classes).
  This is the **product repo**, not Corey's school vault. Other tools handle schoolwork.
- ❌ **Do not change the framework** (React/Vite/Zustand/Tailwind stack) without strong justification.

---

## 8. Audio Rules (CRITICAL)

Audio is the most fragile asset. Follow these rules:

1. **Source of truth for dialogue is `src/data/*.ts`.** When regenerating audio, parse
   dialogue from the TS files — do NOT maintain a parallel Python dictionary.
2. **Voice assignment:** Speaker A → `zh-CN-XiaoxiaoNeural` (female), Speaker B →
   `zh-CN-YunxiNeural` (male), Narrator → `zh-CN-XiaoxiaoNeural`.
3. **Generation command:**
   ```bash
   python3 -m edge_tts --voice zh-CN-XiaoxiaoNeural --text "..." --write-media line-00.mp3
   ```
4. **Naming:** `public/audio/<exerciseId>/line-NN.mp3` (zero-padded) and `full.mp3`.
5. **After regenerating, ALWAYS run** the audio verifier (see TODO.md P0):
   ```bash
   # TODO: add scripts/verify-audio.ts — for now, manual check
   for ex in ex-001 ex-002 ...; do
     python3 -c "import re,os; lines=len(re.findall(r'speaker:', open('src/data/...ts').read())); ..."
   done
   ```
6. **Verify on production** after deploy: `curl -I https://vce-chineselistening.ruttkay-gpt.workers.dev/audio/<exerciseId>/line-NN.mp3`.

---

## 9. Content Rules

- **Original content only.** Do NOT copy VCE exam material or any other copyrighted source.
- Use realistic spoken Mandarin conventions (particles, natural pauses, conversational
  transitions) but keep content appropriate for VCE Second Language learners.
- Categories to cover well: **Future / Careers / Employment** and **School / Education / Study**.
- Always include: Chinese text, pinyin (with tone marks), English translation, vocabulary list,
  full English translation.
- Marking points must have **at least one of:** `chineseKeywords` (for keyword match) or a
  clear `englishMeaning`. Currently `englishMeaning` is not used by `aiMarking.ts`; improve
  that later.

---

## 10. Coding Conventions

- TypeScript strict-ish (`strict: false` but `noImplicitAny: false` to allow fast iteration).
- React functional components with hooks. No class components.
- Zustand for state. Local state with `useState`. Refs with `useRef`.
- Tailwind utility classes. CSS variables in `src/index.css` for theme tokens.
- No external CSS-in-JS, no styled-components.
- File names: PascalCase for components (`AudioPlayer.tsx`), camelCase for hooks/stores.
- Icons via `lucide-react`.

---

## 11. BUILD → TEST → COMMIT → PUSH

The mandatory flow at the end of every meaningful change:

```bash
npm run build               # 1. Build — catches type errors
# (if tests exist) npm test  # 2. Test
git diff                    # 3. Review your diff
git add -p                  # 4. Stage logically
git commit -m "feat: ..."   # 5. Commit with conventional prefix
git push                    # 6. Push to main → Cloudflare auto-deploys
```

---

## 12. Session Start Checklist

At the start of every session, before touching anything:

```bash
git status                  # check uncommitted changes
git log --oneline -10       # recent commits
git pull                    # get latest
cat PROJECT_STATUS.md       # current phase + known bugs
cat TODO.md                 # current backlog
```

If anything looks like the previous session left work unfinished, finish it before starting new work.

---

## 13. Session End Checklist

Before declaring a session complete:

- [ ] `npm run build` passes
- [ ] `git status` is clean (or only contains intentional WIP)
- [ ] All meaningful changes are committed and pushed
- [ ] `PROJECT_STATUS.md` is updated (last-updated date + new findings)
- [ ] `TODO.md` is updated (checked off completed items, added new ones)
- [ ] `CHANGELOG.md` has an entry for user-facing changes
- [ ] No secrets committed
- [ ] No unrelated schoolwork added

---

## 14. When You're Stuck

1. Re-read the relevant section of `PROJECT_STATUS.md`.
2. Re-read this file.
3. Re-read the actual code — don't guess.
4. Probe production with `curl -I` to verify behaviour.
5. If still stuck, leave a clear note in PROJECT_STATUS.md describing what you tried and what's blocking.

**Do not silently make destructive changes.** If you discover something that needs to change,
document it, commit the safe parts, and stop.