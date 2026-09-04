# VCE 中文听力 | VCE Chinese Listening Practice

An adaptive listening practice web application designed for VCE Chinese Second Language students.

## Features

- 🎧 **Daily Listening Practice** — Mandarin Chinese dialogues with adjustable speed (0.75x–2.0x)
- 📝 **VCE-Style Questions** — Multiple choice, specific information, why/reason, comparison, complex mark questions
- 🤖 **AI-Assisted Marking** — Semantic matching against structured marking points
- 📊 **Adaptive System** — Targets weak topics, question types, and adjusts difficulty/speed
- 📈 **Statistics Dashboard** — Performance by topic, question type, difficulty, and speed
- 🀄 **Full Transcripts** — Chinese text, pinyin, English translation, vocabulary (shown after completion)
- 🎯 **VCE Topics** — 18 categories aligned with VCE Chinese study design

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Zustand (state management with persistence)
- Web Speech API (free TTS, no backend required)
- React Router v7

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Cloudflare Pages

This is a static SPA — deploy the `dist/` folder to Cloudflare Pages.

## VCE Topics Covered

Personal Life, Family, School, Festivals, Lifestyle, Travel, Food, Leisure, Employment, Future Aspirations, Study, Study Abroad, Chinese Culture, Chinese Society, Chinese Philosophies, Myths & Legends, Contemporary China, Social & Economic Development
