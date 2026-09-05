# PROJECT_STATUS.md — Session Continuity Document

> **Purpose:** A new agent session should read this file FIRST and immediately know what exists, what's done, what is broken, and what to do next. **Do not restart the project — pick up where the last session left off.**

---

## REPOSITORY
- **GitHub:** https://github.com/TheronEagle/vce-chinese-listening
- **Branch:** main
- **Owner:** TheronEagle
- **Working tree on takeover:** clean (single commit `2c34f1b`)

---

## CURRENT PHASE
Phase 2 — Takeover + Bug-Fix (audio/data alignment audit complete)

---

## PRODUCT
A free VCE Chinese Second Language listening-practice web app. Students complete Mandarin
listening exercises, answer VCE-style questions in Chinese, get AI-assisted semantic marking,
review transcripts and vocabulary, and build adaptive practice based on weaknesses.

Central learning loop:
LISTEN → TAKE NOTES → ANSWER → GET MARKED → REVIEW TRANSCRIPT → IDENTIFY WEAKNESSES → ADAPT

---

## PRODUCTION URL (LIVE ✅)
- **https://vce-chineselistening.theroneagle.workers.dev** *(subdomain changed from the
  earlier `ruttkay-gpt` — Cloudflare Workers subdomain)*
- Hosted on **Cloudflare Pages** (auto-deploy from GitHub `main`)
- Audio assets served at `/audio/<exerciseId>/<line-XX>.mp3` and `/audio/<exerciseId>/full.mp3`

⚠️ **Previously broken audio URLs (BUG-001) are now fixed** — verified live, all 22
previously-404 URLs (ex-002/003/005/006/007/008/009/010/011/012/013) return HTTP 200.
See "FIXED BUGS" below.

---

## STACK

| Layer | Tech |
|-------|------|
| Frontend | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| State | Zustand 5 + `persist` middleware (localStorage) |
| Routing | React Router v7 (BrowserRouter) |
| Icons | lucide-react |
| TTS (audio source) | **edge-tts** (Microsoft Edge neural voices) — committed as MP3s |
| TTS (fallback) | Web Speech API (`speechSynthesis`) |
| Deployment | Cloudflare Pages (static SPA, `wrangler.toml` points at `dist/`) |
| Lint | oxlint |
| Backend | **None** — fully client-side |

---

## FRONTEND ROUTES
- `/` → HomePage (dashboard, streak, accuracy, recommendations, exercise list)
- `/practice` → PracticePage (full practice loop)
- `/practice/custom` → CustomPracticePage (filter by topic/difficulty)
- `/stats` → StatsPage (performance breakdowns)
- `/settings` → SettingsPage (data reset)

---

## STATE / DATA LAYER

### Stores (Zustand)
- `usePracticeStore` — current session (exercise, answers, audio state, transcript lock)
- `useStatsStore` — persistent stats via `persist` middleware, key `vce-chinese-stats`

### Services
- `services/audio.ts` — pre-generated MP3 playback with Web Speech fallback
- `services/aiMarking.ts` — keyword + simplified semantic matching against marking points
- `services/adaptive.ts` — weak-topic / weak-question-type / difficulty / speed recommendation engine

### Components
- `components/layout/Layout.tsx` — bottom nav (Home / Practice / Stats / Settings)
- `components/audio/AudioPlayer.tsx` — play all + per-line + speed selector
- `components/questions/QuestionCard.tsx` — MC + written answer input, feedback, model answer
- `components/common/Transcript.tsx` — collapsible transcript with pinyin/English toggles, vocabulary
- `components/common/ListeningNotes.tsx` — per-exercise notes persisted to localStorage `vce-listening-notes`

### Data
- `data/topics.ts` — 18 VCE categories with Chinese names + emojis
- `data/sample-exercises.ts` — `SAMPLE_EXERCISES` (re-exports 4 inline + 14 spread from 4 other files)
- `data/more-exercises.ts` — ex-005, ex-006, ex-007
- `data/exercises-batch3.ts` — ex-008, ex-009, ex-010
- `data/exercises-batch4.ts` — ex-011, ex-012, ex-013
- `data/exercises-career-school.ts` — ex-014, ex-015, ex-016, ex-017, ex-018

**Total: 18 exercises.**

---

## AUDIO SYSTEM

### Inventory
- **163 MP3 files** under `public/audio/ex-001/` … `public/audio/ex-018/`
- Each exercise has: 6–10 `line-NN.mp3` files (per-line) + 1 `full.mp3` (full dialogue)
- Total size: **8.4 MB** committed to git
- Format: MPEG ADTS layer III, mono, 24 kHz, 48 kbps
- Durations: per-line ~2–9 sec; full-dialogue ~36–47 sec

### TTS Provider (discovered from `scripts/generate-audio*.py`)
- **edge-tts** (Microsoft Edge neural voices)
- Speaker A: `zh-CN-XiaoxiaoNeural` (female)
- Speaker B: `zh-CN-YunxiNeural` (male)
- Narrator: same as A (XiaoxiaoNeural)
- Run with: `python3 -m edge_tts --voice <voice> --text "<text>" --write-media <path>`

### Audio Playback
- Source-of-truth path: `/audio/<exerciseId>/line-NN.mp3` (per-line) and `/audio/<exerciseId>/full.mp3`
- Frontend uses pre-cached `HTMLAudioElement` instances, sets `playbackRate` for speed control
- On `error` event, falls back to `speechSynthesis` with zh-CN + pitch-based speaker distinction

---

## CRITICAL BUGS (P0)

### ✅ FIXED — BUG-001 — Audio/dialogue alignment broken for 12 of 18 exercises
**Status:** RESOLVED in commit `11c884f fix: repair exercise audio alignment`. Verified
locally (`verify-audio.ts` reports `18/18 aligned`) and on production (all 22 previously-404
URLs now return HTTP 200, including `/audio/ex-008/line-08.mp3`).

**Fix approach:**
- Rewrote `scripts/generate-audio.py` to make `src/data/*.ts` the single source of truth.
  No more parallel Python dialogue dictionary.
- Phase 1: generated 14 missing per-line files (line-08/line-09 for ex-002/003/005/006/007/
  008/009/010) — preserves existing aligned audio.
- Phase 2: regenerated all audio for ex-004 / ex-011 / ex-012 (which had audio for the wrong
  conversation).
- Phase 3: deleted 2 orphaned MP3s for ex-013 (line-06, line-07 — data was trimmed to 6 lines
  but audio still had 8). Regenerated full.mp3 for the current 6-line dialogue.

**New tooling:**
- `scripts/_audio_lib.py` — shared library (parser, generator).
- `scripts/verify-audio.ts` — already existed, now serves as regression catcher.

### 🟡 BUG-002 — `hasAudioFile()` returns true unconditionally
`src/services/audio.ts:144-147`:
```ts
export function hasAudioFile(exerciseId: string): boolean {
  // We assume audio files exist for all exercises since we generated them
  return true;
}
```
This is a footgun — used by any future caller that wants to gate UI on audio presence. Should
return false for exercises with missing audio (see BUG-001).

### 🟡 BUG-003 — `recordSession` aggregates marks across all questions of a session
`src/stores/statsStore.ts:117-125`: when recording a session, every question type in the
session gets `qs.totalMarks += total; qs.marksAwarded += marks;` — this is the **session**
total, not per-question totals. So question-type accuracy is wrong (always equal to session
accuracy). Should iterate `session.answers` and add each answer's `marksAwarded` / `marksTotal`
to the corresponding type. **Stats shown are misleading.**

---

## EXISTING COMPLETED WORK

### ✅ Built & verified working
- [x] Vite + React 19 + TypeScript project scaffold, builds cleanly (`npm run build` → 5.13s, 417 kB JS gzipped to 126 kB)
- [x] Tailwind CSS v4 via `@tailwindcss/vite`
- [x] React Router v7 with 5 routes
- [x] Zustand 5 stores (practice + persisted stats)
- [x] 18 VCE topic categories with Chinese names + emojis
- [x] **18 complete exercises** with full Chinese dialogue + pinyin + English + vocabulary
- [x] Audio player: play-all / per-line / speed 0.75x–2.0x
- [x] Listening notes (persisted per-exercise in localStorage)
- [x] Question card: MC + written answer with submit / retry / model answer / marking points
- [x] Transcript component with pinyin/English toggles + vocabulary + full translation
- [x] **Transcript lock** (PracticePage hides transcript until results shown)
- [x] Stats: streak / accuracy / topic breakdown / question-type breakdown / difficulty / speed / recent sessions
- [x] Adaptive recommendation engine
- [x] AI marking engine (keyword + simplified semantic)
- [x] 5 bottom-nav pages (Home / Practice / Custom Practice / Stats / Settings)
- [x] Reset stats confirmation flow
- [x] Cloudflare Pages deployment (auto-deploys from `main`)
- [x] 18 exercises × edge-tts MP3 audio (XiaoxiaoNeural + YunxiNeural)

### ✅ Documentation in place (this takeover updates them)
- [x] README.md — architecture, deployment, exercise format
- [x] PROJECT_STATUS.md — this file
- [x] TODO.md — prioritised backlog
- [x] CHANGELOG.md — version history
- [x] AGENTS.md — instructions for future agents (created this session)

---

## CURRENT TASK
BUG-001 fixed and verified live on production. BUG-003 (question-type accuracy) is the next
P0 task but **must wait for explicit instruction** — the spec said "Do not proceed to BUG-003
until BUG-001 is completely verified locally and in production."

---

## NEXT TASKS (prioritised)

### Priority 0 — Critical
1. **BUG-003: Question-type accuracy bug** — fix `recordSession` to use per-answer marks instead
   of session totals. Awaiting go-ahead from user (BUG-001 verification gate).

### Priority 1 — Product correctness
2. **BUG-002: `hasAudioFile()` should actually probe audio** — wire it to a HEAD fetch or read
   the manifest.
3. Add **audio alignment verifier** to CI / pre-commit (`scripts/verify-audio.ts` already exists;
   wire it into a `pre-commit` hook or GitHub Action).
4. Confirm `notes` saved per session actually persist with attempt metadata (currently keyed only
   by exerciseId; if student retries, notes are lost on completion? — re-read `ListeningNotes.tsx`).

### Priority 2 — Content
5. Add 5-mark and 6-mark complex questions (already typed in `QuestionType` enum but rarely used).
6. Add comparison questions.
7. Add exercises for missing categories: `chinese_society`, `chinese_philosophies`,
   `social_economic`, `study`, more `family`.

### Priority 3 — Quality
8. Improve `aiMarking.ts` semantic matching — currently EnglishMeaning branch returns `false`
   always (line 38).
9. Mobile UX pass (PracticePage is dense on small screens).
10. Lazy-load pages (code splitting).

### Priority 4 — Deployment
11. Verify Cloudflare Pages auto-deploy from `main` continues to work (works as of 2026-09-05,
    including the new `theroneagle.workers.dev` subdomain).
12. Custom domain (optional).

---

## TESTS
- **No unit tests** yet.
- TypeScript compile: ✅ (`tsc -b` passes)
- Vite build: ✅ (`npm run build` passes, 417 kB JS / 25 kB CSS)
- Dev server: ✅ verified during prior session (not re-verified this session)

### Suggested first tests
- `services/aiMarking.test.ts` — verify marking points add up correctly, partial credit
- `services/adaptive.test.ts` — verify weak-topic / weak-qtype selection
- `stores/statsStore.test.ts` — fix BUG-003 first, then add regression test

---

## DEPLOYMENT STATUS
- **Live:** https://vce-chineselistening.ruttkay-gpt.workers.dev
- **Last deploy:** same as last commit (`2c34f1b`) — assets match exactly
- **CI/CD:** none configured locally; Cloudflare Pages auto-builds on push to `main`
- **`wrangler.toml`** points at `dist/` (correct)

---

## IMPORTANT ARCHITECTURAL DECISIONS

- **Static SPA, no Workers.** App is 100% client-side. No DB, no API. Stats are localStorage only.
- **Pre-generated audio, not runtime TTS.** `public/audio/*.mp3` is the source of truth. Edge-tts
  generation is offline. Web Speech API is only a runtime fallback for missing/errored files.
- **Single source of truth for data is TS files.** Future audio regeneration should read
  dialogue from `src/data/*.ts`, not from a parallel Python dictionary.
- **localStorage keys:** `vce-chinese-stats` (Zustand persist) and `vce-listening-notes` (per-exercise notes).

---

## EXISTING AUDIO INVENTORY

```
public/audio/  (175 MP3 files, 9.2 MB committed to git — verified aligned 2026-09-05)
├── ex-001/  (9 lines + full) — Future Aspirations
├── ex-002/  (9 lines + full) — Festivals (中秋)
├── ex-003/  (10 lines + full) — Study Abroad
├── ex-004/  (8 lines + full) — Chinese Culture (中医)
├── ex-005/  (10 lines + full) — Food
├── ex-006/  (10 lines + full) — Employment
├── ex-007/  (9 lines + full) — Lifestyle
├── ex-008/  (10 lines + full) — Travel
├── ex-009/  (10 lines + full) — Contemporary China
├── ex-010/  (10 lines + full) — Myths & Legends (龙)
├── ex-011/  (8 lines + full) — School
├── ex-012/  (8 lines + full) — Festivals (嫦娥)
├── ex-013/  (6 lines + full) — Leisure (周末做什么)
├── ex-014/  (8 lines + full) — Career/Arts
├── ex-015/  (8 lines + full) — School/Homework
├── ex-016/  (8 lines + full) — Gap Year
├── ex-017/  (8 lines + full) — Part-time Work
└── ex-018/  (8 lines + full) — Study Abroad / Australia
```

All 18 exercises' data lines match their audio file count and content.
Verified by `node --experimental-strip-types scripts/verify-audio.ts` → `18/18 aligned`.

---

## AUDIT METHODOLOGY (for reproducibility)

This audit was performed by:
1. `git status && git remote -v && git log` — verified single-commit history
2. Reading every TS/TSX file in `src/`, `scripts/`, and root configs
3. Running `npm run build` — verified clean TypeScript + Vite build
4. Listing `public/audio/` recursively and parsing file metadata with `afinfo`
5. Parsing exercise dialogue from `src/data/*.ts` and audio dialogue from `scripts/generate-audio*.py`,
   then cross-comparing each exercise's data-lines vs audio-files count + content
6. Probing production URL with `curl -I` for SPA + audio assets

---

## LAST UPDATED
2026-09-05 (takeover audit session)