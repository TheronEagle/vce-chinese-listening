# VCE 中文听力 | VCE Chinese Listening Practice

An adaptive listening practice web application designed for VCE Chinese Second Language students.

**Live:** https://github.com/TheronEagle/vce-chinese-listening

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

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **State:** Zustand (with localStorage persistence for stats)
- **Audio:** Web Speech API (free, browser-native TTS — no backend required)
- **Routing:** React Router v7
- **Icons:** Lucide React

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

Output goes to `dist/` — a static SPA ready to deploy anywhere.

---

## Deploy to Cloudflare Pages

This app is a **static SPA** — the simplest deployment is **Cloudflare Pages** (not Workers).

### Option A: Cloudflare Dashboard (recommended)

1. Push your repo to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Select the `vce-chinese-listening` repo
4. Configure:
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** set environment variable `NODE_VERSION=22`
5. Click **Save and Deploy**
6. Your app will be live at `https://vce-chinese-listening.pages.dev`

### Option B: Wrangler CLI

```bash
# Install wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=vce-chinese-listening
```

### Option C: GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy dist --project-name=vce-chinese-listening
```

Then add `CLOUDFLARE_API_TOKEN` as a GitHub secret (create token at Cloudflare → My Profile → API Tokens → Create Token → Edit Cloudflare Pages permission).

### Custom Domain

After deploying:
1. Go to Cloudflare Dashboard → Pages → your project → **Custom domains**
2. Add your domain (e.g., `listening.yourschool.com`)
3. Cloudflare handles SSL automatically

### Why Pages, not Workers?

- **Workers** = serverless compute (for APIs, SSR, dynamic backends)
- **Pages** = static site hosting (for SPAs, no server needed)
- This app is 100% client-side — no API calls, no server, no database. Pages is the right fit.
- If you later add a backend (user accounts, cloud sync), you can add Workers alongside Pages.

---

## Project Structure

```
src/
├── types/index.ts          # All TypeScript type definitions
├── data/
│   ├── topics.ts           # VCE category definitions, helpers
│   ├── sample-exercises.ts # Exercise data (4 exercises)
│   └── more-exercises.ts   # Additional exercises (3 more)
├── stores/
│   ├── practiceStore.ts    # Current session state (Zustand)
│   └── statsStore.ts       # Persistent stats (Zustand + localStorage)
├── services/
│   ├── aiMarking.ts        # Answer grading engine
│   ├── adaptive.ts         # Weakness detection & recommendations
│   └── audio.ts            # Web Speech API wrapper
├── components/
│   ├── audio/AudioPlayer.tsx
│   ├── questions/QuestionCard.tsx
│   ├── common/Transcript.tsx
│   └── layout/Layout.tsx
└── pages/
    ├── HomePage.tsx         # Dashboard, recommendations, exercise list
    ├── PracticePage.tsx     # Main practice loop
    ├── CustomPracticePage.tsx # Filter & select exercises
    ├── StatsPage.tsx        # Performance analytics
    └── SettingsPage.tsx     # Reset data, about
```

## Key Files for Continuity

| File | Purpose |
|------|---------|
| `PROJECT_STATUS.md` | Current phase, completed work, next tasks, blockers |
| `TODO.md` | Prioritised task list |
| `CHANGELOG.md` | Version history |
| `README.md` | This file — architecture, deployment, everything |

## Adding New Exercises

Each exercise follows this structure in `src/data/more-exercises.ts`:

```typescript
{
  id: 'ex-008',
  createdAt: '2026-09-04',
  script: {
    id: 'script-008',
    title: '标题',
    topic: 'travel',           // VCE category
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
      id: 'q-008-mc',
      type: 'multiple_choice',  // QuestionType
      chineseQuestion: '问题？',
      englishInstruction: 'Question?',
      marks: 1,
      options: ['A', 'B', 'C', 'D'],
      correctOptionIndex: 1,
    },
    {
      id: 'q-008-why',
      type: 'why_reason',
      chineseQuestion: '为什么？',
      englishInstruction: 'Why?',
      marks: 2,
      markingPoints: [
        { id: 'mp-x', keyIdea: 'key idea', englishMeaning: 'English meaning', chineseKeywords: ['关键词'], marks: 1 },
      ],
      modelAnswer: '参考答案',
    },
  ],
}
```

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

The system checks for Chinese keywords in the student's answer. Each matched marking point awards its allocated marks. Feedback shows which points were missed.

## Adaptive Engine

Tracks per-student:
- Topic accuracy (e.g., "festivals" = 72%, "employment" = 91%)
- Question type accuracy (e.g., "comparison" = 57%, "main idea" = 92%)
- Difficulty performance
- Audio speed performance
- Streak tracking

Generates recommendations that deliberately target weaknesses.
