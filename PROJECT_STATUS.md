# PROJECT_STATUS.md — Session Continuity Document

> **Purpose:** A new agent session should read this file FIRST and immediately know what exists, what's done, and what to do next. Do not restart the project — pick up where the last session left off.

## REPOSITORY
- **GitHub:** https://github.com/TheronEagle/vce-chinese-listening
- **Branch:** main
- **Owner:** TheronEagle

## CURRENT PHASE:
Phase 1 — MVP Core (mostly complete)

## COMPLETED (as of 2026-09-04):

### Infrastructure
- [x] Vite + React 19 + TypeScript project scaffold
- [x] Tailwind CSS v4 with Vite plugin
- [x] Zustand for state management
- [x] React Router v7 for routing
- [x] Lucide React for icons
- [x] TypeScript builds clean (`npm run build` passes)
- [x] Dev server works (`npm run dev`)
- [x] `.gitignore`, `tsconfig.app.json` configured

### Data Layer
- [x] `src/types/index.ts` — Complete type definitions (Exercise, Question, MarkingPoint, UserStats, etc.)
- [x] `src/data/topics.ts` — 18 VCE categories with Chinese names, emojis, helper functions
- [x] `src/data/sample-exercises.ts` — 4 exercises (future aspirations, festivals, study abroad, Chinese culture)
- [x] `src/data/more-exercises.ts` — 3 more exercises (food, employment, lifestyle)
- [x] `src/data/exercises-batch3.ts` — 3 more exercises (family, travel, contemporary China)
- [x] `src/data/exercises-batch4.ts` — 3 more exercises (school, myths/legends, leisure)
- [x] Total: **13 exercises** with full Chinese dialogues, pinyin, English translations, vocabulary, structured marking points

### State Management
- [x] `src/stores/practiceStore.ts` — Current session state (exercise, answers, audio, playback)
- [x] `src/stores/statsStore.ts` — Persistent stats via Zustand `persist` middleware (localStorage). Tracks topic accuracy, question type accuracy, difficulty, speed, streaks, recent sessions.

### Services
- [x] `src/services/aiMarking.ts` — Grades answers against marking points using keyword matching
- [x] `src/services/adaptive.ts` — Recommends exercises targeting weak topics/question types, suggests difficulty/speed progression
- [x] `src/services/audio.ts` — Web Speech API wrapper for Chinese TTS (male/female voice distinction via pitch)

### Components
- [x] `src/components/layout/Layout.tsx` — App shell with bottom navigation (Home, Practice, Stats, Settings)
- [x] `src/components/audio/AudioPlayer.tsx` — Play all, play per-line, speed selector (0.75x–2.0x)
- [x] `src/components/questions/QuestionCard.tsx` — MC + written answer input, feedback display, model answers
- [x] `src/components/common/Transcript.tsx` — Collapsible transcript with pinyin/English toggles, vocabulary, full translation

### Pages
- [x] `src/pages/HomePage.tsx` — Dashboard: streak, accuracy, exercises count; daily listening CTA; adaptive recommendations; weak topics alert; exercise library list
- [x] `src/pages/PracticePage.tsx` — Full practice loop: audio player → question cards → submit → mark → results → transcript
- [x] `src/pages/CustomPracticePage.tsx` — Filter exercises by topic and difficulty
- [x] `src/pages/StatsPage.tsx` — Performance by topic, question type, difficulty, speed, recent sessions
- [x] `src/pages/SettingsPage.tsx` — Reset data, about section

### Documentation
- [x] `README.md` — Architecture, deployment guide (Cloudflare Pages), exercise format, VCE topics
- [x] `PROJECT_STATUS.md` — This file
- [x] `TODO.md` — Prioritised task list
- [x] `CHANGELOG.md` — Version history

## CURRENTLY WORKING ON:
- Nothing in progress — ready for next session to continue

## NEXT TASKS (prioritised):

### Priority 1 — Content (highest impact)
1. **Add more exercises** — Need at least 10-15 covering all VCE topics. Currently missing: family, school, travel, leisure, study, chinese_society, chinese_philosophies, myths_legends, contemporary_china, social_economic
2. **Add complex question types** — Need exercises with 5-mark and 6-mark questions
3. **Add comparison questions** — Students are weak on these

### Priority 2 — Features
4. **Improve marking accuracy** — Current keyword matching is basic. Could add fuzzy matching, synonym detection, or API-based semantic grading
5. **Add timed practice mode** — Countdown timer matching VCE exam conditions
6. **Add progress charts** — Line/bar charts showing improvement over time (use recharts or similar)
7. **Add bookmark/favourite exercises**

### Priority 3 — Polish
8. **Mobile UX improvements** — Test on actual mobile devices
9. **Add exercise completion animations** — Confetti/celebration on good scores
10. **Code splitting** — Lazy load pages for faster initial load

### Priority 4 — Deployment
11. **Deploy to Cloudflare Pages** — `npm run build` → upload `dist/`
12. **Set up GitHub Actions CI/CD** — Auto-deploy on push to main
13. **Add custom domain** (optional)

## BLOCKERS:
- None currently

## TECH STACK:
- **Framework:** React 19 + TypeScript
- **Build:** Vite 8
- **Styling:** Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **State:** Zustand 5 with persist middleware
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Audio:** Web Speech API (browser-native, free)
- **Deployment target:** Cloudflare Pages (static SPA)

## DATABASE:
- **Local:** localStorage via Zustand persist (stats only)
- **No server-side DB needed** for MVP

## AI PROVIDER:
- **Current:** Client-side keyword matching against structured marking points
- **Future option:** Could integrate OpenAI/Claude API for semantic grading (would need backend/Workers)

## TTS PROVIDER:
- **Current:** Web Speech API (free, browser-native)
- **Supports:** Chinese (zh-CN) voices
- **Male/female:** Differentiated via pitch adjustment
- **Limitation:** Voice quality varies by browser/OS

## CLOUDFLARE:
- **Architecture:** Cloudflare Pages (static site hosting)
- **Deploy:** `npm run build` → upload `dist/` folder
- **Wrangler:** `npx wrangler pages deploy dist --project-name=vce-chinese-listening`
- **No Workers needed** unless adding server-side features later

## TEST STATUS:
- TypeScript: Clean build ✅
- Vite production build: ✅
- Dev server: ✅
- No unit tests yet (not critical for MVP)

## GIT HISTORY:
```
e02cb34 feat: add 3 more exercises (school, myths/legends, leisure)
e978197 chore: gitignore workflow dir until PAT has workflow scope
a0448c5 chore: remove workflow file (needs workflow scope)
1941310 feat: add 3 more exercises (family, travel, contemporary China)
4a3bf5c docs: add Cloudflare Pages deployment, comprehensive continuity docs
ce79f40 feat: add custom practice page with topic/difficulty filters
70f91a4 docs: update project status, add 3 exercises, verify dev server
5d0de92 feat: add 3 more exercises (food, employment, lifestyle)
af2fb65 feat: initial VCE Chinese listening practice app
```

## SESSION START CHECKLIST:
1. `git pull` — get latest
2. Read this file (PROJECT_STATUS.md)
3. Read TODO.md
4. `npm install` — install deps
5. `npm run dev` — verify app runs
6. Pick up from NEXT TASKS above
7. `npm run build` before committing
8. Commit and push regularly

## LAST UPDATED:
2026-09-04T19:55:00+08:00
