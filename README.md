The Trading Post

A cross-platform bartering & marketplace app with rich gamificationUsers can buy, sell, barter and socialize via chat & map, earn XP, streaks, quests, badges, and even host personal “shops” like modern MySpace storefronts.

Table of Contents

Features

Tech Stack

Prerequisites

Project Structure

Backend Setup (Flask / Python)

Environment Variables

Virtual Environment & Dependencies

Database & Seeding

Running the Server

API Overview

Frontend Setup (React Native / TypeScript)

Install & Start

Expo & Device Testing

Testing & Linting

Deployment

Contributing

License

Features

Core Marketplace: Listings, chat, map-based search & clustering

Barter & Currency: Real money via Stripe, internal tokens, or barter-only

User Shops: Personal storefront (name, slug, theme, logo, banner, items)

Gamification: XP & levels, daily login streaks, daily/weekly quests

Badges & Achievements: Earned badges, progress tracker, printable certificates

Social & Community: Follow traders, leaderboards, forums, events & meetups

Wallet & Crypto: Token dashboard, optional crypto balances

Offline & PWA: Offline caching, custom fallback, splash screen, dark mode

Notifications: Push/email on messages, offers, quest refresh

Tech Stack

Backend: Python 3.10+, Flask, SQLAlchemy, Flask-JWT-Extended, Alembic (optional), Stripe

Frontend: React Native (Expo), TypeScript, React Navigation, Context + Hooks

DB: SQLite (dev) or PostgreSQL (prod)

Notifications: Expo Notifications, AsyncStorage

Maps: Mapbox GL

Prerequisites

Node.js ≥16 & Yarn (or npm)

Python ≥3.10

Expo CLI (npm install -g expo-cli)

(Optional) Xcode / Android Studio for simulators

Git

Project Structure

trading-post/
├── backend/                  # Flask API
│   ├── .env                  # env vars (SECRET_KEY, DATABASE_URL, STRIPE_KEY…)
│   ├── run.py                # Flask entrypoint
│   ├── server/
│   │   ├── app.py            # Flask app + DB init
│   │   └── config.py         # Config classes
│   ├── database/
│   │   ├── seed.py           # Seed sample data
│   │   └── migrations/       # Alembic migrations (if used)
│   ├── models/               # SQLAlchemy models
│   │   ├── user.py
│   │   ├── item.py
│   │   ├── shop.py           # NEW: user shop metadata
│   │   ├── shop_item.py      # NEW: shop↔item mapping
│   │   ├── xp_transaction.py
│   │   ├── streak.py
│   │   ├── quest.py
│   │   └── user_quest.py
│   ├── routes/               # Blueprint endpoints
│   │   ├── auth.py
│   │   ├── items.py
│   │   ├── shop.py           # NEW: shop CRUD
│   │   ├── shop_items.py     # NEW: shop‐item CRUD
│   │   ├── xp.py
│   │   ├── streaks.py
│   │   └── quests.py
│   └── utils/
│       ├── xp_calculator.py
│       ├── streak_logic.py
│       ├── shop_helpers.py   # NEW: slug generation, themes
│       └── …other helpers…
└── trading-post-mobile/      # React Native app
    ├── App.tsx
    ├── babel.config.js
    ├── tsconfig.json
    ├── package.json
    ├── assets/
    │   └── bg-stars.json
    └── src/
        ├── components/       # Reusable UI: XPBar, StreakTracker, QuestCard…
        ├── context/          # Auth, XP, Streak, Quests, Theme, Socket
        ├── hooks/            # useAuth, useXP, useStreak, useQuests…
        ├── screens/          # Login, Home, Map, Chat, Quests, Storefront…
        ├── navigation/       # React Navigation stacks & tabs
        ├── services/         # api.ts + authService, xpService, streakService…
        ├── theme/            # colors.ts, spacing.ts, typography.ts, radii.ts, shadows.ts
        ├── styles/           # global.ts, components.ts
        └── utils/            # geolocation, notification, offlineCache…

Backend Setup (Flask / Python)

Environment Variables

Copy .env.example → .env and fill in:

SECRET_KEY=supersecret
JWT_SECRET_KEY=jwtsecret
DATABASE_URL=sqlite:///data.db    # or postgres://user:pass@host/db
STRIPE_API_KEY=sk_test_...
MAPBOX_TOKEN=pk.XXXX
EMAIL_HOST=smtp.mailtrap.io
EMAIL_USER=...
EMAIL_PASS=...

Virtual Environment & Dependencies

cd backend
python3 -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt

Database & Seeding

# (Optional) Run Alembic migrations
alembic upgrade head

# Seed sample data
python database/seed.py

Running the Server

python run.py

The API will listen on http://localhost:5000.

API Overview

Auth

POST /api/auth/register

POST /api/auth/login

Users & Profiles

GET/PUT /api/profile

Items & Marketplace

GET /api/items, POST /api/items, etc.

Shops

GET /api/shop/me – your storefront

GET /api/shop/<slug> – public shop

POST /api/shop / PUT /api/shop – create/update

GET /api/shop_items/<shop_id> – list items

POST/PUT/DELETE /api/shop_items – manage items

Gamification

GET /api/xp, POST /api/xp/add

GET /api/streaks, POST /api/streaks/login

GET /api/quests, POST /api/quests/<id>/complete, POST /api/quests/refresh

Other: chat, events, forums, referrals, wallet, QR, notifications, etc.

Frontend Setup (React Native / TypeScript)

Install & Start

cd trading-post-mobile
yarn install      # or npm install
expo start

i opens iOS Simulator

a opens Android Emulator

Scan the QR code with Expo Go on a real device

Code Quality & Formatting

Add to .vscode/settings.json:

{
  "editor.formatOnSave": true,
  "eslint.validate": ["javascript", "typescript", "typescriptreact"],
  "prettier.requireConfig": true
}

Make sure you’ve installed:

ESLint & Prettier extensions

React Native Tools (optional)

Testing & Linting

Backend: add pytest tests in backend/tests/, run pytest

Frontend: add Jest tests, run yarn test

Both: yarn lint / npm run lint

Deployment

Backend:

Heroku / DigitalOcean / AWS Elastic Beanstalk

Set your .env vars in the platform’s dashboard

Frontend:

Expo builds via expo build:ios / expo build:android

Or publish PWA with expo build:web

Host web on Netlify / Vercel

Contributing

Fork the repo & create a feature branch

Install deps & run tests locally

Submit PR with clear description & tests

We’ll review & merge!

License

MIT ©

Built with ❤️ for stronger local communities and a sustainable circular economy.