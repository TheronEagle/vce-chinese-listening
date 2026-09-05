# CHANGELOG.md

## [Unreleased] — 2026-09-05 — Beta-readiness QA pass

### Added
- **Vitest test suite** with 29 passing tests covering QuestionCard
  click flow, full PracticePage Q1→Q2→Q3→Finish flow, statsStore
  per-type aggregation, and the audio verifier.
- **FeedbackButton** — floating bottom-right button + modal with 7
  student-friendly categories ("Question unclear", "Answer marked wrong
  (but I think it's right)", "Audio not playing or wrong", "Typo or
  translation issue", "Technical issue / something broken", "Suggestion",
  "Other"). Opens pre-filled mailto with current exerciseId +
  questionId context. Mounted globally via Layout.
- **Per-question-type breakdown** on the Results page, with weak-skill
  hint callout.
- **Per-question progress bar** in QuestionCard header.
- **Audio playback controls on every transcript line** — students can
  re-listen to a specific line while reviewing notes.
- **Notes always visible during review** (were hidden after submission;
  now stay editable so students can compare).
- **Aria-pressed** on toggle buttons (pinyin/English), **aria-label**
  on QuestionDots differentiating correct vs incorrect answered states,
  **role="radio"** on MC options.

### Changed
- **Q1→Q2 progression bug fixed**: `<QuestionCard>` now keyed by
  `question.id` so React fully remounts when currentQuestionIndex
  changes (was reusing component instance, leaking state).
- **BUG-003 stats**: `recordSession` now aggregates per-answer marks
  into per-question-type buckets (was adding whole session totals to
  every type — made per-type accuracy equal session accuracy).
- **BUG-002 hasAudioFile()**: now actually probes audio via Audio
  element with timeout, caches result per exercise.
- **Below-card "View Results" button removed** (was duplicating the
  in-card Finish button after submission).
- **Audio service** uses real probe (not hard-coded true).
- **QuestionCard header** shows "第 N 题 / M" + "X marks" + progress bar.
- **AudioPlayer** shows audio availability status; uses real icon
  imports; per-line playback + speed control + missing-audio notice.
- **Transcript component** has Play Full / Stop controls, per-line
  Play buttons, line numbers, collapsible vocab/translation.
- **FeedbackButton** categories made student-friendly; removed
  navigator.userAgent from email body (no unnecessary tech info).

### Fixed
- Build error in FeedbackButton (used `MessageSquareWarning` which is
  not exported by lucide-react@0.468 — switched to `MessageSquarePlus`).
- Import path in Layout.tsx (`../components/common/...` → `../common/...`).
- useEffect reference bug in PracticePage (feedback-context effect
  was referencing `currentQuestion` before it was declared; moved
  after declaration).
- 4 missing `sourceReference` fields on main_idea questions
  (q-002-main, q-004-main, q-005-main, q-012-main).
- QuestionDots answered-state colour-only indication: now uses
  explicit borders + ring around current dot + descriptive aria-labels.

### Tests added (10 new)
- `QuestionCard-flow.test.tsx` (5 tests): click flow, multiple-option
  switching, MC submit index, key-remount isolation.
- `PracticePage-flow.test.tsx` (5 tests): full Q1→Q2→Q3→Finish, written
  question flow, Try Again isolation, navigation preservation, Finish
  on last question.

### Content added
- ex-019: School camp announcement (monologue)
- ex-020: Study abroad reflection (monologue)
- ex-021: Study habits discussion (dialogue)
- Brings total to **21 exercises**, **202 audio files (12 MB)**,
  **93 questions** across 14 question-type categories.

---

## [0.3.0] — 2026-09-04 — Takeover + critical bug fixes

### Fixed
- **BUG-001 (P0)**: 12 of 18 exercises had broken audio/data alignment.
  ex-004, ex-011, ex-012 had audio for the wrong conversation entirely.
  ex-002/003/005-010 had missing line-08/09 MP3s. ex-013 had orphaned
  audio for old dialogue. All 21 exercises' audio regenerated and
  aligned with current TypeScript data. Verified live:
  `/audio/ex-008/line-08.mp3` now returns HTTP 200.

### Changed
- scripts/generate-audio.py rewritten to make `src/data/*.ts` the
  single source of truth (no parallel Python dialogue dictionary).
- scripts/verify-audio.ts added — automated alignment checker.
- Production URL: theroneagle subdomain (was ruttkay-gpt).

---

## [0.2.0] — 2026-09-04

### Added
- Custom practice page with topic and difficulty filters
- Cloudflare Pages deployment config (`wrangler.toml`)
- GitHub Actions CI/CD workflow (`.github/workflows/deploy.yml`)
- Comprehensive README with Cloudflare deployment guide (3 methods)
- PROJECT_STATUS.md with full session continuity documentation
- Updated TODO.md with prioritised task list

### Changed
- Improved README with project structure, exercise format docs, VCE topic table

---

## [0.1.0] — 2026-09-04

### Added
- Initial project scaffold (Vite + React 19 + TypeScript + Tailwind CSS v4)
- Complete type system for VCE Chinese listening exercises
- 18 VCE topic categories aligned with study design
- 7 sample listening exercises with full Chinese dialogue scripts:
  - ex-001: 小明的理想职业 (Future Aspirations)
  - ex-002: 春节的习俗 (Festivals)
  - ex-003: 留学生活 (Study Abroad)
  - ex-004: 中医养生 (Chinese Culture)
  - ex-005: 中国菜的故事 (Food)
  - ex-006: 找兼职工作 (Employment)
  - ex-007: 健康的生活方式 (Lifestyle)
- Question types: MC, which-three, why/reason, advantages, comparison,
  main idea, cause/effect, complex marks
- Audio player with Web Speech API (Chinese TTS, speed control 0.75x–2.0x)
- AI-assisted marking service with keyword matching against structured marking points
- Adaptive recommendation engine targeting student weaknesses
- Persistent statistics tracking (localStorage)
- Full practice loop: listen → → answer → → AI mark → → see results → → update stats
- Home page with daily listening, recommendations, exercise library
- Practice page with audio player, question cards, transcript viewer
- Custom practice page with topic/difficulty filters
- Statistics page with performance breakdown by topic/type/difficulty/speed
- Settings page with data management

---

## [Pre-1.0] — 2026-09-05 (squashed history)

### Added
- **edge-tts integration**: replaced Web Speech API as primary audio
  source with pre-generated MP3 files (XiaoxiaoNeural + YunxiNeural voices).
  163 files (8.4 MB) committed to git.
- **5 more exercise batches**: ex-008 through ex-018 added (Travel,
  Contemporary China, Myths & Legends, Leisure, Family-ish topics,
  Career/Arts, School/Homework, Gap Year, Part-time Work, Study
  Abroad/Australia).
- **ListeningNotes component**: per-exercise notes persisted to
  localStorage (`vce-listening-notes` key).
- **Transcript lock**: PracticePage hides transcript until student
  submits answers.
- **AudioPlayer** with per-line playback + speed selector.
- **Audio service abstraction** with Web Speech API fallback when MP3
  fails to load.