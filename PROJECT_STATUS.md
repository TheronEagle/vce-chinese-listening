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
- **https://vce-chineselistening.ruttkay-gpt.workers.dev**
- Hosted on **Cloudflare Pages** (auto-deploy from GitHub `main`)
- Built assets currently serving: `index-CsdtOt8t.js`, `index-Dw4D9Sxx.css`
- Audio assets served at `/audio/<exerciseId>/<line-XX>.mp3` and `/audio/<exerciseId>/full.mp3`

⚠️ **Known production issue** (see "CRITICAL BUGS"): exercises with broken audio return
404 on production, silently degrading to Web Speech API for affected lines.

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

### 🔴 BUG-001 — Audio/dialogue alignment broken for 12 of 18 exercises

**Symptom:** Some audio files are missing or contain a completely different conversation than
what the questions ask about. Students see one topic, hear another.

**Verified mismatches (data lines vs audio lines):**

| Exercise | Topic | Data lines | Audio files | Audio content | Status |
|----------|-------|-----------:|------------:|---------------|--------|
| ex-001 | Future Aspirations | 9 | 9 | matches | ✅ OK |
| ex-002 | Festivals (中秋) | 9 | 8 | same topic, missing line-08 | ⚠️ Missing |
| ex-003 | Study Abroad | 10 | 8 | same topic, missing line-08/09 | ⚠️ Missing |
| **ex-004** | **Chinese Culture (中医)** | 8 | 8 | **WRONG content** — audio is about 春节, data is about 中医 | 🔴 Content mismatch |
| ex-005 | Food | 10 | 8 | same topic, missing line-08/09 | ⚠️ Missing |
| ex-006 | Employment | 10 | 8 | same topic, missing line-08/09 | ⚠️ Missing |
| ex-007 | Lifestyle | 9 | 8 | same topic, missing line-08 | ⚠️ Missing |
| ex-008 | Travel | 10 | 8 | same topic, missing line-08/09 | ⚠️ Missing |
| ex-009 | Contemporary China | 10 | 8 | same topic, missing line-08/09 | ⚠️ Missing |
| ex-010 | Myths & Legends (龙) | 10 | 8 | same topic, missing line-08/09 | ⚠️ Missing |
| **ex-011** | **School** | 8 | 8 | **WRONG content** — audio is about 周末休闲, data is about 学校 | 🔴 Content mismatch |
| **ex-012** | **Festivals** | 8 | 8 | **WRONG content** — audio is about 选大学, data is about 中秋节 | 🔴 Content mismatch |
| ex-013 | Leisure | 6 | 8 | same topic, lines 6–7 orphaned, line count mismatch | ⚠️ Content/dim mismatch |
| ex-014 | Career/Arts | 8 | 8 | matches | ✅ OK |
| ex-015 | School/Homework | 8 | 8 | matches | ✅ OK |
| ex-016 | Gap Year | 8 | 8 | matches | ✅ OK |
| ex-017 | Part-time Work | 8 | 8 | matches | ✅ OK |
| ex-018 | Study Abroad / Australia | 8 | 8 | matches | ✅ OK |

**Confirmed live on production:** `curl -I https://vce-chineselistening.ruttkay-gpt.workers.dev/audio/ex-008/line-08.mp3` → **HTTP 404**.

**Why it happened:** Audio was generated from earlier dialogue drafts in `scripts/generate-audio.py`.
The exercise data in `src/data/*.ts` was subsequently rewritten/expanded without regenerating audio.
Specifically:
- ex-013 had dialogue trimmed from 8 → 6 lines (audio orphaned, never updated)
- ex-004 / ex-011 / ex-012 had their dialogue completely replaced (audio is for the OLD dialogue)
- ex-002, ex-003, ex-005–ex-010 had 2 extra dialogue lines added (line-08 and/or line-09 missing)

**Fix path (P0 — must be next task):**
1. Pick the source-of-truth dialogue for each broken exercise (recommendation: keep the data
   TS, since that's what students see + answer questions about).
2. Regenerate the missing audio files using `scripts/generate-audio.py` (edit it to include
   updated dialogue, then run `python3 scripts/generate-audio.py` with `edge_tts` installed).
3. For ex-004 / ex-011 / ex-012 — regenerate ALL audio from current TS dialogue.
4. For ex-013 — either re-expand the dialogue to 8 lines OR trim the audio files to line-00…line-05.
5. Verify on production: `curl -I https://...workers.dev/audio/ex-008/line-08.mp3` → 200.
6. Add a CI assertion (e.g., a small `scripts/verify-audio.ts` script) that asserts every
   dialogue line index N has a corresponding `public/audio/<exerciseId>/line-NN.mp3`.

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
Takeover complete. Documentation updated, audit findings recorded. **Next session should fix BUG-001.**

---

## NEXT TASKS (prioritised)

### Priority 0 — Critical (fix in next session)
1. **BUG-001: Audio/data alignment** — regenerate missing/incorrect audio for ex-002/003/004/005/006/007/008/009/010/011/012/013. See detailed fix path above.
2. **BUG-003: Question-type accuracy bug** — fix `recordSession` to use per-answer marks instead of session totals.

### Priority 1 — Product correctness
3. **BUG-002: `hasAudioFile()` should actually probe audio** — wire it to a HEAD fetch or read the manifest.
4. Add **audio alignment verifier** script (`scripts/verify-audio.ts`) to CI / pre-commit.
5. Make `generate-audio.py` import from `src/data/*.ts` so audio always matches data (single source of truth).
6. Confirm `notes` saved per session actually persist with attempt metadata (currently keyed only by exerciseId; if student retries, notes are lost on completion? — re-read `ListeningNotes.tsx`).

### Priority 2 — Content
7. Add 5-mark and 6-mark complex questions (already typed in `QuestionType` enum but rarely used).
8. Add comparison questions.
9. Add exercises for missing categories: `chinese_society`, `chinese_philosophies`, `social_economic`, `study`, more `family`.

### Priority 3 — Quality
10. Improve `aiMarking.ts` semantic matching — currently EnglishMeaning branch returns `false` always (line 38).
11. Mobile UX pass (PracticePage is dense on small screens).
12. Lazy-load pages (code splitting).

### Priority 4 — Deployment
13. Verify Cloudflare Pages auto-deploy from `main` is working.
14. Custom domain (optional).

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
public/audio/
├── ex-001/  (9 lines, full.mp3) — Future Aspirations — ✅ aligned
├── ex-002/  (8 lines, full.mp3) — Festivals (中秋) — ⚠️ missing line-08
├── ex-003/  (8 lines, full.mp3) — Study Abroad — ⚠️ missing line-08, line-09
├── ex-004/  (8 lines, full.mp3) — Chinese Culture — 🔴 WRONG content (春节 vs 中医)
├── ex-005/  (8 lines, full.mp3) — Food — ⚠️ missing line-08, line-09
├── ex-006/  (8 lines, full.mp3) — Employment — ⚠️ missing line-08, line-09
├── ex-007/  (8 lines, full.mp3) — Lifestyle — ⚠️ missing line-08
├── ex-008/  (8 lines, full.mp3) — Travel — ⚠️ missing line-08, line-09
├── ex-009/  (8 lines, full.mp3) — Contemporary China — ⚠️ missing line-08, line-09
├── ex-010/  (8 lines, full.mp3) — Myths & Legends — ⚠️ missing line-08, line-09
├── ex-011/  (8 lines, full.mp3) — School — 🔴 WRONG content (周末 vs 学校)
├── ex-012/  (8 lines, full.mp3) — Festivals — 🔴 WRONG content (选大学 vs 中秋节)
├── ex-013/  (8 lines, full.mp3) — Leisure — ⚠️ content trimmed (6 lines), 2 audio orphaned
├── ex-014/  (8 lines, full.mp3) — Career/Arts — ✅ aligned
├── ex-015/  (8 lines, full.mp3) — School/Homework — ✅ aligned
├── ex-016/  (8 lines, full.mp3) — Gap Year — ✅ aligned
├── ex-017/  (8 lines, full.mp3) — Part-time Work — ✅ aligned
└── ex-018/  (8 lines, full.mp3) — Study Abroad/Australia — ✅ aligned
```

Total: 18 exercises × ~9 audio files = 163 MP3 files, 8.4 MB.

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