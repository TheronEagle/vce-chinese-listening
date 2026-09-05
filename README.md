# VCE 中文听力 | VCE Chinese Listening Practice

An adaptive listening practice web application designed for VCE Chinese Second Language students.

**Live:** https://vce-chineselistening.ruttkay-gpt.workers.dev (Cloudflare Pages, auto-deploy from `main`)

## Features

- 🎧 **Daily Listening Practice** — Mandarin Chinese dialogues with adjustable speed (0.75x–2.0x)
- 📝 **VCE-Style Questions** — Multiple choice, specific information, why/reason, comparison, complex mark questions
- 🤖 **AI-Assisted Marking** — Semantic matching against structured marking points
- 📊 **Adaptive System** — Targets weak topics, question types, and adjusts difficulty/speed
- 📈 **Statistics Dashboard** — Performance by topic, question type, difficulty, and speed
- 🀄 **Full Transcripts** — Chinese text, pinyin, English translation, vocabulary (shown after completion)
- 🎯 **VCE Topics** — 18 categories aligned with VCE Chinese study design
- 🔍 **Custom Practice** — Filter exercises by topic and difficulty

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite`)
- **State:** Zustand 5 (with localStorage persistence for stats)
- **Audio:** **Pre-generated edge-tts MP3 files** (Microsoft neural voices XiaoxiaoNeural + YunxiNeural) — 163 files committed to git. Falls back to Web Speech API at runtime if an MP3 fails to load.
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Deployment:** Cloudflare Pages (auto-deploy from GitHub `main`)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```bash
npm run build
```

Output goes to `dist/` — a static SPA ready to deploy anywhere.

---

## Deployment

**Current production deployment:** Cloudflare Pages, auto-deploying from the `main` branch of
`github.com/TheronEagle/vce-chinese-listening`.

Live URL: **https://vce-chineselistening.ruttkay-gpt.workers.dev**

The repository's `wrangler.toml` points at `dist/`:
```toml
name = "vce-chineselistening"
compatibility_date = "2024-01-01"

[assets]
directory = "./dist"
```

To deploy manually (not normally needed — Cloudflare auto-builds on push):

```bash
npm install -g wrangler
wrangler login
npm run build
npx wrangler pages deploy dist --project-name=vce-chineselistening
```

### Custom Domain

After deploying, in the Cloudflare Dashboard → Pages → `vce-chineselistening` → Custom domains,
add your domain. Cloudflare handles SSL automatically.

### Why Cloudflare Pages, not Workers?

- **Workers** = serverless compute (for APIs, SSR, dynamic backends)
- **Pages** = static site hosting (for SPAs, no server needed)
- This app is 100% client-side — no API calls, no server, no database. Pages is the right fit.
- If you later add a backend (user accounts, cloud sync), you can add Workers alongside Pages.

---

## Project Structure

```
src/
├── types/index.ts                  # All TypeScript type definitions
├── data/
│   ├── topics.ts                   # VCE category definitions, helpers
│   ├── sample-exercises.ts         # SAMPLE_EXERCISES aggregator (18 total)
│   ├── more-exercises.ts           # ex-005, ex-006, ex-007
│   ├── exercises-batch3.ts         # ex-008, ex-009, ex-010
│   ├── exercises-batch4.ts         # ex-011, ex-012, ex-013
│   └── exercises-career-school.ts  # ex-014, ex-015, ex-016, ex-017, ex-018
├── stores/
│   ├── practiceStore.ts            # Current session state (Zustand)
│   └── statsStore.ts               # Persistent stats (Zustand + localStorage)
├── services/
│   ├── aiMarking.ts                # Answer grading engine
│   ├── adaptive.ts                 # Weakness detection & recommendations
│   └── audio.ts                    # MP3 player + Web Speech API fallback
├── components/
│   ├── audio/AudioPlayer.tsx
│   ├── questions/QuestionCard.tsx
│   ├── common/Transcript.tsx
│   ├── common/ListeningNotes.tsx
│   └── layout/Layout.tsx
└── pages/
    ├── HomePage.tsx                # Dashboard, recommendations, exercise list
    ├── PracticePage.tsx            # Main practice loop
    ├── CustomPracticePage.tsx      # Filter & select exercises
    ├── StatsPage.tsx               # Performance analytics
    └── SettingsPage.tsx            # Reset data, about

public/
├── audio/
│   ├── ex-001/...ex-018/           # 18 exercises × ~9 MP3 files
│   └── (163 MP3 files, 8.4 MB, committed to git)
├── favicon.svg
└── icons.svg

scripts/
├── generate-audio.py               # Original audio generator (ex-001..ex-013)
├── generate-audio-new.py           # Additional generator (ex-014..ex-018)
└── verify-audio.ts                 # Alignment verifier (data lines vs audio files)
```

## Key Files for Continuity

| File | Purpose |
|------|---------|
| `PROJECT_STATUS.md` | Current phase, completed work, **critical bugs**, next tasks, blockers |
| `TODO.md` | Prioritised task list (P0..P4) |
| `CHANGELOG.md` | Version history |
| `AGENTS.md` | Instructions for future AI coding agents |
| `README.md` | This file — architecture, deployment, everything |

---

## Adding New Exercises

Each exercise follows this structure in `src/data/<batch>.ts`:

```typescript
{
  id: 'ex-XXX',
  createdAt: 'YYYY-MM-DD',
  script: {
    id: 'script-XXX',
    title: '中文标题',
    topic: 'travel',           // VCECategory from types/index.ts
    difficulty: 'intermediate', // beginner | intermediate | advanced
    dialogue: [
      { speaker: 'A', speakerName: '名字', chinese: '中文', pinyin: 'pīnyīn', english: 'English' },
      // ...
    ],
    vocabulary: [
      { chinese: '词', pinyin: 'cí', english: 'word', partOfSpeech: 'noun' },
    ],
    fullEnglish: 'Full translation...',
  },
  questions: [
    {
      id: 'q-XXX-mc',
      type: 'multiple_choice',  // QuestionType from types/index.ts
      chineseQuestion: '问题？',
      englishInstruction: 'Question?',
      marks: 1,
      options: ['A', 'B', 'C', 'D'],
      correctOptionIndex: 1,
      sourceReference: 'relevant dialogue line(s)',
    },
    {
      id: 'q-XXX-why',
      type: 'why_reason',
      chineseQuestion: '为什么？',
      englishInstruction: 'Why?',
      marks: 2,
      markingPoints: [
        { id: 'mp-x', keyIdea: 'key idea', englishMeaning: 'English meaning', chineseKeywords: ['关键词'], marks: 1 },
      ],
      modelAnswer: '参考答案',
      sourceReference: 'relevant dialogue line(s)',
    },
  ],
}
```

**After adding the exercise, also generate audio** (see "Generating Audio" below) and verify with `scripts/verify-audio.ts`.

## VCE Topics (18 categories)

| Category | Chinese | Emoji |
|----------|---------|-------|
| personal_life | 个人生活 | 👤 |
| family | 家庭 | 👨‍👩‍👧‍👦 |
| school | 学校 | 🏫 |
| festivals | 节日 | 🎉 |
| lifestyle | 生活方式 | 🌿 |
| travel | 旅游 | ✈️ |
| food | 饮食 | 🍜 |
| leisure | 休闲 | 🎮 |
| employment | 就业 | 💼 |
| future_aspirations | 未来理想 | 🌟 |
| study | 学习 | 📚 |
| study_abroad | 留学 | 🎓 |
| chinese_culture | 中华文化 | 🏮 |
| chinese_society | 中国社会 | 🇨🇳 |
| chinese_philosophies | 中国哲学 | ☯️ |
| myths_legends | 神话传说 | 🐉 |
| contemporary_china | 当代中国 | 🏙️ |
| social_economic | 社会经济发展 | 📈 |

## AI Marking System

Written answers are graded against structured **marking points**:

```
Question: 为什么小明想当老师？（3分）

Marking Points:
1. English and Chinese grades are good (1 mark)
2. Can teach in China and overseas (1 mark)
3. Students will like him, he'll be happy (1 mark)
```

The system checks for Chinese keywords in the student's answer. Each matched marking point
awards its allocated marks. Feedback shows which points were missed. See
`src/services/aiMarking.ts`.

## Adaptive Engine

Tracks per-student:
- Topic accuracy (e.g., "festivals" = 72%, "employment" = 91%)
- Question type accuracy (e.g., "comparison" = 57%, "main idea" = 92%)
- Difficulty performance
- Audio speed performance
- Streak tracking

Generates recommendations that deliberately target weaknesses. See
`src/services/adaptive.ts`.

---

## Generating Audio

This project uses **edge-tts** (Microsoft Edge neural voices) to pre-generate Mandarin audio:

```bash
pip install edge-tts
python3 scripts/generate-audio.py        # generates ex-001..ex-013
python3 scripts/generate-audio-new.py    # generates ex-014..ex-018
```

Voice mapping:
- Speaker A → `zh-CN-XiaoxiaoNeural` (female)
- Speaker B → `zh-CN-YunxiNeural` (male)
- Narrator → `zh-CN-XiaoxiaoNeural`

After generating audio, verify alignment:

```bash
npx tsx scripts/verify-audio.ts   # checks every dialogue line has a matching MP3
```