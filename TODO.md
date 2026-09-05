# TODO.md

## ✅ Done (as of 2026-09-05 beta-readiness QA)

### Phase 1 — Initial build
- [x] Project scaffold (Vite + React 19 + TS + Tailwind v4)
- [x] Type system for exercises, questions, stats, sessions
- [x] 18 VCE topic categories with Chinese names + emojis
- [x] 18 listening exercises with full Chinese dialogues, pinyin, English, vocabulary
- [x] Audio player with play-all, per-line, speed 0.75x–2.0x
- [x] Listening notes (persisted per exercise in localStorage)
- [x] Transcript component with pinyin/English toggles + vocab + full translation
- [x] Transcript lock (PracticePage) — hidden until completion
- [x] Question card (MC + written, feedback, model answer)
- [x] AI-assisted marking engine (keyword + simplified semantic match)
- [x] Adaptive recommendation engine (weak topics, weak q-types, difficulty, speed)
- [x] Persistent statistics (localStorage via Zustand persist)
- [x] Stats page: streak, accuracy, by topic, by question type, by difficulty, by speed, recent sessions
- [x] 5 routes: Home / Practice / Custom Practice / Stats / Settings
- [x] Custom practice with topic + difficulty filters
- [x] Cloudflare Pages auto-deploy from `main`
- [x] Audio: edge-tts (XiaoxiaoNeural + YunxiNeural), MP3, committed to git (163 files, 8.4 MB)

### Phase 2 — Takeover + critical bug fixes
- [x] **BUG-001**: All 12 broken exercises' audio regenerated (21/21 aligned)
- [x] scripts/generate-audio.py rewritten to use TS data as source of truth
- [x] scripts/verify-audio.ts as regression catcher
- [x] **Q1→Q2 progression bug** fixed: `key={question.id}` forces remount
- [x] **BUG-003 stats**: per-answer aggregation (was per-session, misleading)
- [x] **BUG-002 hasAudioFile()**: actually probes audio instead of returning true
- [x] Added ex-019/020/021 (3 new exercises, +2 monologues, varied question types)
- [x] Vitest test framework installed
- [x] 29 tests passing (QuestionCard flow, PracticePage flow, statsStore, audio verify)

### Phase 3 — Beta-readiness QA (this session)
- [x] Build error fixed (FeedbackButton MessageSquareWarning → MessageSquarePlus)
- [x] Layout import path fixed
- [x] useEffect reference bug fixed (currentQuestion used before declaration)
- [x] Duplicate Next/Finish button removed
- [x] 4 missing sourceReferences added (q-002/004/005/012 main)
- [x] QuestionDots accessibility improved (aria-label, border)
- [x] FeedbackButton student-friendly categories + context

---

## 🟡 Known limitations (acceptable for beta)

- Audio is pre-generated MP3s only; Web Speech API is a fallback but rarely used. New audio requires regenerating via `scripts/generate-audio.py`.
- aiMarking is keyword-based + simplified semantic (englishMeaning branch is currently no-op). Not LLM-powered.
- Adaptive system uses heuristics (accuracy thresholds, exercise counts). Not ML.
- No user accounts — stats live in localStorage only.
- Audio data is committed to git (8.4 MB now, growing). Acceptable for now.
- No offline-mode detection (works offline naturally though).

---

## 🎯 Recommended next steps (post-beta)

### Priority 1 — Polish based on beta feedback (after collecting student feedback)
- [ ] Review feedback-button emails and address real issues
- [ ] Adjust marking keywords based on what students flag
- [ ] Identify any exercises that consistently score low → review content
- [ ] Mobile real-device test (iPhone Safari, Android Chrome) — not just code-level

### Priority 2 — Content expansion (wait for beta feedback first)
- [ ] Add more monologues (currently 3/21 are monologues)
- [ ] Add exercises for: chinese_society, chinese_philosophies, social_economic
- [ ] More 5-mark and 6-mark complex questions (only 4 currently)
- [ ] More inference / perspective questions
- [ ] Add listening comprehension for dialects/regional variations

### Priority 3 — Quality improvements
- [ ] Improve aiMarking.ts semantic match (englishMeaning branch)
- [ ] Add unit tests for adaptive.ts
- [ ] Lazy-load pages (code splitting)
- [ ] Add progress charts in stats page (recharts)
- [ ] Better mobile layout testing on real devices

### Priority 4 — Production polish
- [ ] Set up Cloudflare Pages GitHub Action CI/CD
- [ ] Custom domain
- [ ] Move audio to R2 if repo size grows beyond ~30 MB
- [ ] Monitor bundle size (currently 463 kB JS — comfortable)

---

## 🛑 Out-of-scope (do NOT do without explicit user request)

- ❌ Do not migrate TTS to CosyVoice or any other system — current edge-tts is acceptable
- ❌ Do not add user accounts / cloud sync — product is intentionally free + local
- ❌ Do not switch to a database — localStorage is the chosen model
- ❌ Do not add paid tiers, ads, or monetization
- ❌ Do not change the framework (React/Vite/Zustand/Tailwind stack)
- ❌ Do not generate unrelated schoolwork (essays, exam papers, etc.)

---

## 📋 Process rules

1. Read `PROJECT_STATUS.md` and this file at the start of every session.
2. Run `git pull`, `npm install` if needed, `npm run build` before committing.
3. Run `npm test` — must pass 29/29.
4. Run `node --experimental-strip-types scripts/verify-audio.ts` — must show 21/21.
5. One commit per logical change. Use conventional prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
6. After fixing audio, verify on production: `curl -I https://vce-chineselistening.theroneagle.workers.dev/audio/<ex>/line-NN.mp3`.
7. Update CHANGELOG.md on every shipped change.