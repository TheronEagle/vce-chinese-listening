# TODO.md

> Backlog for `vce-chinese-listening`. Update statuses as work progresses.

## ✅ Done (as of 2026-09-05)

- [x] Project scaffold (Vite + React 19 + TS + Tailwind v4)
- [x] Type system for exercises, questions, stats, sessions
- [x] 18 VCE topic categories with Chinese names + emojis
- [x] **18 listening exercises** with full Chinese dialogues, pinyin, English, vocabulary
- [x] Audio player with play-all, per-line, speed 0.75x–2.0x
- [x] Listening notes (persisted per exercise in localStorage)
- [x] Transcript component with pinyin/English toggles + vocab + full translation
- [x] **Transcript locked until completion** (PracticePage)
- [x] Question card: MC + written answer + marking-points feedback + model answer
- [x] AI-assisted marking engine (keyword + simplified semantic match)
- [x] Adaptive recommendation engine (weak topics, weak q-types, difficulty, speed)
- [x] Persistent statistics (localStorage via Zustand persist)
- [x] Stats page: streak, accuracy, by topic, by question type, by difficulty, by speed, recent sessions
- [x] 5 routes: Home / Practice / Custom Practice / Stats / Settings
- [x] Custom practice with topic + difficulty filters
- [x] Cloudflare Pages auto-deploy from `main`
- [x] Audio: edge-tts (XiaoxiaoNeural + YunxiNeural), MP3, committed to git (163 files, 8.4 MB)
- [x] Documentation: README, PROJECT_STATUS, CHANGELOG, AGENTS, this TODO

---

## 🔴 P0 — Critical (fix before adding new features)

- [ ] **BUG-001**: Regenerate audio for 12 broken exercises (ex-002/003/004/005/006/007/008/009/010/011/012/013)
  - ex-004 / ex-011 / ex-012: full regen (content was completely replaced)
  - ex-002 / ex-005 / ex-006 / ex-007 / ex-008 / ex-009 / ex-010: missing line-08 and/or line-09
  - ex-003: missing line-08, line-09
  - ex-013: data trimmed to 6 lines; audio still has 8 (decide: expand data back to 8, or trim audio)
  - **Plan:** rewrite `scripts/generate-audio.py` to import dialogue from `src/data/*.ts` directly,
    run `python3 scripts/generate-audio.py`, verify all `public/audio/<exerciseId>/line-NN.mp3` exist.
- [ ] **BUG-003**: Fix `recordSession` question-type aggregation (currently session totals bleed into every q-type)
- [ ] Add CI / pre-commit assertion: `scripts/verify-audio.ts` that every dialogue line index N
      has a corresponding `public/audio/<exerciseId>/line-NN.mp3`

---

## 🎯 P1 — Product features

- [ ] **BUG-002**: Make `hasAudioFile()` actually probe audio (HEAD fetch or manifest)
- [ ] Persist notes per-attempt (currently keyed only by exerciseId — wiped on retry?)
- [ ] Daily streak notification / reminder
- [ ] Bookmark / favourite exercises
- [ ] Timed practice mode (countdown matching VCE conditions)
- [ ] Speed challenge (start at 2.0x and graduate down?)
- [ ] Random VCE practice button (different from "daily")
- [ ] Weakness practice mode (force-fail: only exercises in weak topics)

---

## 🧪 P2 — Quality / correctness

- [ ] Improve `aiMarking.ts` semantic match — currently EnglishMeaning branch returns `false` (line 38)
- [ ] Add `chineseKeywords` aliases / fuzzy matching (currently exact substring after normalisation)
- [ ] Add unit tests: `aiMarking.test.ts`, `adaptive.test.ts`, `statsStore.test.ts`
- [ ] Mobile UX pass (PracticePage is dense on small screens)
- [ ] Code splitting: lazy-load pages with `React.lazy`
- [ ] Loading skeletons
- [ ] Completion animations (confetti on good scores)
- [ ] Resume exercise after page reload (persist `practiceStore` selectedExerciseId + currentQuestionIndex)

---

## 📚 P3 — Content expansion

- [ ] Add exercises for missing categories: `chinese_society`, `chinese_philosophies`, `social_economic`, more `study`, more `family`
- [ ] Add 5-mark and 6-mark complex questions (QuestionType already defined)
- [ ] Add comparison questions (two-speaker compare/contrast)
- [ ] Add opinion/attitude questions (already typed, underused)
- [ ] Bilingual gloss pop-up for unknown characters in transcript
- [ ] Vocabulary mistake tracking (declared in `UserStats.vocabularyWeaknesses` but never populated)

---

## 🚀 P4 — Deployment / infra

- [ ] Confirm Cloudflare Pages auto-deploy from `main` is current
- [ ] Add GitHub Actions CI: typecheck + build on PR
- [ ] Add GitHub Actions CD: deploy to Cloudflare Pages on push to `main` (currently relies on Cloudflare's own auto-deploy)
- [ ] Custom domain (optional)
- [ ] Consider moving audio to R2 if repo size grows (currently 8.4 MB committed, fine for now)

---

## 🛑 Out-of-scope (do NOT do without explicit user request)

- ❌ Do not add user accounts / cloud sync — product is intentionally free + local
- ❌ Do not switch to a database — localStorage is the chosen model
- ❌ Do not replace Web Speech fallback unless it actually causes user-reported issues
- ❌ Do not regenerate all audio — keep the existing files; only fix the 12 broken ones
- ❌ Do not add paid tiers, ads, or monetization
- ❌ Do not change the framework (React/Vite/Zustand stack)
- ❌ Do not generate unrelated schoolwork (essays, exam papers, etc.) — see AGENTS.md

---

## 📋 Process rules

1. Read `PROJECT_STATUS.md` and this file at the start of every session.
2. Run `git pull`, `npm install` if needed, `npm run build` before committing.
3. One commit per logical change. Use conventional prefixes: `feat:`, `fix:`, `chore:`,
   `docs:`, `refactor:`, `test:`.
4. After fixing audio, verify on production: `curl -I https://vce-chineselistening.ruttkay-gpt.workers.dev/audio/<ex>/line-NN.mp3`
5. Update CHANGELOG.md on every shipped change.