# CHANGELOG.md

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
