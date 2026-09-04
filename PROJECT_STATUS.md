# PROJECT_STATUS.md

## CURRENT PHASE:
Phase 1 — MVP Core (in progress)

## COMPLETED:
- ✅ Project scaffold (Vite + React + TypeScript + Tailwind CSS v4)
- ✅ Type definitions (types/index.ts)
- ✅ VCE topic/category data (18 categories from study design)
- ✅ Sample exercises with full dialogue scripts (4 exercises)
- ✅ Question types: multiple choice, which three, why/reason, advantages, comparison, main idea, cause/effect, complex 4-mark
- ✅ Zustand practice store (session state management)
- ✅ Zustand stats store (persistent statistics with localStorage)
- ✅ AI marking service (keyword + semantic matching against marking points)
- ✅ Adaptive engine (weakness detection, difficulty/speed progression, recommendations)
- ✅ Audio service (Web Speech API with male/female voice distinction)
- ✅ AudioPlayer component (play all, play per-line, speed control)
- ✅ QuestionCard component (MC + written answers, feedback display)
- ✅ Transcript component (Chinese/pinyin/toggle, vocabulary, full translation)
- ✅ Layout with bottom navigation
- ✅ HomePage (stats overview, daily listening CTA, recommendations, exercise library)
- ✅ PracticePage (full practice loop: listen → answer → mark → results)
- ✅ StatsPage (performance by topic, question type, difficulty, speed, recent sessions)
- ✅ SettingsPage (reset data, about section)
- ✅ TypeScript builds clean
- ✅ Vite production build succeeds

## CURRENTLY WORKING ON:
- Waiting for GitHub PAT to create repo and push
- Added 3 more exercises (food, employment, lifestyle)
- Dev server verified working

## NEXT TASK:
1. Create GitHub repo and push initial code
2. Add more exercises (aim for 10+ covering all VCE topics)
3. Improve AI marking with better semantic matching
4. Add custom practice page (filter by topic/difficulty/question type)
5. Polish UI and mobile responsiveness
6. Deploy to Cloudflare Pages

## BLOCKERS:
- Need GitHub personal access token to create repo and push

## TECH STACK:
- Frontend: React 19 + TypeScript + Vite
- Styling: Tailwind CSS v4
- State: Zustand (with persist middleware for stats)
- Routing: React Router v7
- Icons: Lucide React
- Audio: Web Speech API (free, no backend needed)
- Build: Vite

## DATABASE:
- Local: localStorage via Zustand persist (for stats)
- Future: Cloudflare D1 for server-side persistence

## AI PROVIDER:
- Currently: Client-side keyword matching for marking
- Future: Can integrate API-based semantic marking

## TTS PROVIDER:
- Web Speech API (free, browser-native)
- Supports Chinese (zh-CN) voices
- Male/female differentiation via pitch

## CLOUDFLARE:
- Architecture: Cloudflare Pages (static SPA)
- Compatible: Yes, pure client-side app

## TEST STATUS:
- TypeScript: Clean build ✅
- Vite build: ✅
- Dev server: ✅ verified running

## LAST UPDATED:
2026-09-04T19:35:00+08:00
