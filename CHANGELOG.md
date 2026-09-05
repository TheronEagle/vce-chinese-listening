# CHANGELOG.md

## [Unreleased] — Takeover audit

### Changed
- README.md: replaced generic Cloudflare Pages instructions with the **actual** production URL
  (`vce-chineselistening.ruttkay-gpt.workers.dev`) and auto-deploy status. Removed obsolete
  `pages.dev` instructions.
- PROJECT_STATUS.md: complete rewrite reflecting the real state after takeover audit —
  18 exercises, edge-tts audio, Cloudflare Pages deployment, current bugs.
- TODO.md: restructured with P0/P1/P2/P3/P4 priorities and the critical audio-alignment bug.

### Added
- AGENTS.md: instructions for future AI coding agents (workflow, rules, audio rules).
- `scripts/verify-audio.ts`: programmatic verification that every dialogue line in
  `src/data/*.ts` has a corresponding `public/audio/<exerciseId>/line-NN.mp3`. Used to
  catch the audio/data alignment regression that produced BUG-001.

### Documented (not fixed yet)
- **BUG-001 (P0)**: 12 of 18 exercises have broken audio/data alignment.
  - ex-004 / ex-011 / ex-012: audio is for a completely different conversation than the data.
  - ex-002 / ex-003 / ex-005 / ex-006 / ex-007 / ex-008 / ex-009 / ex-010 / ex-013:
    audio file count doesn't match data line count.
- **BUG-002 (P2)**: `hasAudioFile()` returns true unconditionally — should probe audio.
- **BUG-003 (P1)**: `recordSession` aggregates session totals into every question-type stat,
  making per-type accuracy equal to session accuracy.

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
- Question types: MC, which-three, why/reason, advantages, comparison, main idea, cause/effect, complex marks
- Audio player with Web Speech API (Chinese TTS, speed control 0.75x–2.0x)
- AI-assisted marking service with keyword matching against structured marking points
- Adaptive recommendation engine targeting student weaknesses
- Persistent statistics tracking (localStorage)
- Full practice loop: listen → answer → AI mark → see results → update stats
- Home page with daily listening, recommendations, exercise library
- Practice page with audio player, question cards, transcript viewer
- Custom practice page with topic/difficulty filters
- Statistics page with performance breakdowns by topic/type/difficulty/speed
- Settings page with data management

---

## [Pre-1.0] — 2026-09-05 (squashed history)

### Added
- **edge-tts integration**: replaced Web Speech API as primary audio source with pre-generated
  MP3 files (XiaoxiaoNeural + YunxiNeural voices). 163 files (8.4 MB) committed to git.
- **5 more exercise batches**: ex-008 through ex-018 added (Travel, Contemporary China, Myths &
  Legends, Leisure, Family-ish topics, Career/Arts, School/Homework, Gap Year, Part-time Work,
  Study Abroad/Australia).
- **ListeningNotes component**: per-exercise notes persisted to localStorage
  (`vce-listening-notes` key).
- **Transcript lock**: PracticePage hides transcript until student submits answers.
- **AudioPlayer with per-line playback + speed selector**.
- **Audio service abstraction** with Web Speech API fallback when MP3 fails to load.