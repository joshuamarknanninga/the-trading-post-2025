```markdown
# The Trading Post

**The Trading Post** is a full-stack, mobile-first marketplace app for **buying new items, selling old/resale goods, and bartering** with neighbors — all in one place. It’s built with React + Vite on the frontend, Flask + Python on the backend, and features interactive maps, chat, wallet, PWA support, and gamified reputation.

---

## 🚀 Features

- **Multi-modal listings**: sell new products, resale/secondhand items, or trade/barter without cash  
- **Hyper-local map**: Mapbox-powered pins, clustering, filters, custom Mapbox Studio theme, geocoder search  
- **In-app chat**: secure messaging to negotiate trades or sales  
- **User profiles & ratings**: identity verification, peer reviews, badges, “Verified Trader” status  
- **Gamification**: spirit animal quiz, badges, progress tracker, token rewards, referral system  
- **Community & forum**: post topics, reply threads, report abuse, admin moderation  
- **Events & meetups**: calendar of swap-meets, RSVP, midpoint meetup suggestions  
- **Wallet & payments**: internal token wallet, crypto balance, Stripe-ready hooks  
- **Admin dashboard**: site stats, user/trade moderation, review report handling  
- **Yearly “Trading Wrapped”**: personalized year-in-review summary  
- **Dark Mode & PWA**: tailwind-based theming, splash screen, offline fallback, mobile nav

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Mapbox GL JS, Heroicons  
- **Backend**: Flask, Flask-CORS, SQLAlchemy, Gunicorn  
- **Database**: SQLite (dev), PostgreSQL or MySQL (prod)  
- **Deployment**: Netlify (frontend), Render (backend)  
- **CI/CD**: GitHub Actions (optional)  

---

## 📁 Repository Structure

```
the-trading-post/
├── README.md
├── .gitignore
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env                   # VITE_MAPBOX_TOKEN
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   └── manifest.json
│   └── src/
│       ├── index.js
│       ├── App.jsx
│       ├── routes.jsx
│       ├── index.css
│       ├── styles/
│       │   ├── globals.css
│       │   ├── animations.css
│       │   └── tailwind-theme.css
│       ├── assets/
│       │   ├── logo.png
│       │   └── bg-stars.svg
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── Footer.jsx
│       │   ├── SplashScreen.jsx
│       │   ├── MobileNavBar.jsx
│       │   └── DarkModeToggle.jsx
│       ├── Auth/
│       │   ├── LoginForm.jsx
│       │   └── RegisterForm.jsx
│       ├── Marketplace/
│       │   ├── ListingCard.jsx
│       │   ├── FiltersBar.jsx
│       │   ├── InventoryTab.jsx
│       │   └── ItemDetails.jsx
│       ├── Map/
│       │   ├── TradeMap.jsx
│       │   ├── MapFilters.jsx
│       │   ├── PopupOverlay.jsx
│       │   ├── ClusterLogic.jsx
│       │   ├── MapTooltip.jsx
│       │   └── mapTheme.json
│       ├── Chat/
│       │   ├── ChatRoom.jsx
│       │   └── MessageBubble.jsx
│       ├── Profile/
│       │   ├── EditProfile.jsx
│       │   ├── PublicProfile.jsx
│       │   └── SpiritAnimalQuiz.jsx
│       ├── Events/
│       │   ├── EventCalendar.jsx
│       │   ├── CreateEventForm.jsx
│       │   └── MeetupSuggest.jsx
│       ├── Wallet/
│       │   └── WalletDashboard.jsx
│       ├── Forum/
│       │   ├── CommunityBoard.jsx
│       │   ├── PostDetail.jsx
│       │   └── NewPostForm.jsx
│       ├── Badges/
│       │   ├── BadgeGallery.jsx
│       │   └── BadgeProgress.jsx
│       ├── Admin/
│       │   ├── Dashboard.jsx
│       │   └── ReviewReports.jsx
│       └── Wrapped/
│           └── TradingWrapped.jsx
│
└── backend/
    ├── requirements.txt
    ├── Procfile
    ├── .env                   # FLASK_ENV=production
    ├── server/
    │   └── app.py
    ├── database/
    │   └── seed.py
    ├── routes/
    │   ├── auth.py
    │   ├── admin.py
    │   ├── chat.py
    │   ├── events.py
    │   ├── forum.py
    │   ├── items.py
    │   ├── map.py             # GET /api/map/pins
    │   ├── marketplace.py
    │   ├── profile.py
    │   ├── qr.py
    │   ├── referrals.py
    │   ├── follow.py
    │   ├── wrapped.py
    │   └── wallet.py
    ├── models/
    │   ├── user.py
    │   ├── item.py
    │   ├── trade_history.py
    │   ├── badges.py
    │   ├── chat.py
    │   ├── event.py
    │   ├── meetup.py
    │   ├── referral.py
    │   ├── forum.py
    │   ├── reports.py
    │   ├── wallet.py
    │   ├── spirit_animal.py
    │   └── trade_wrapped.py
    └── utils/
        ├── badge_logic.py
        ├── email_sender.py
        ├── map_helpers.py
        └── qr_generator.py
```

---

## 🔧 Prerequisites

- **Node.js & npm**  
  Install from https://nodejs.org/  
- **Python 3.8+ & pip**  
  Install from https://python.org/  
- **Git** (optional, for cloning)

---

## ⚙️ Environment Variables

Create **`frontend/.env`**:
```txt
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

Create **`backend/.env`**:
```txt
FLASK_ENV=production
```

---

## 🏗️ Setup & Installation

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/the-trading-post.git
cd the-trading-post
```

---

### 2. Frontend

```bash
cd frontend
npm install
```

- **Run in development**  
  ```bash
  npm run dev
  ```
  Visit `http://localhost:5173`

---

### 3. Backend

```bash
cd ../backend
python -m venv venv
# Activate:
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

- **Seed the database**  
  ```bash
  python database/seed.py
  ```

- **Run server**  
  ```bash
  python server/app.py
  ```
  Visit `http://localhost:5000` and test `GET /api/map/pins`

---

## 🔗 Connecting Frontend & Backend

- In development, frontend uses `http://localhost:5000` for API calls.
- Update fetch URLs or set up a proxy in `vite.config.js` if desired.

---

## ☁️ Deployment

### Frontend → Netlify
1. Push `frontend/` to GitHub  
2. On Netlify: **Import from Git** → build command `npm run build`, publish `dist`  
3. Add `VITE_MAPBOX_TOKEN` in Site Settings → Env Variables

### Backend → Render
1. Push `backend/` to GitHub  
2. On Render: **New Web Service** → select repo  
3. Build command: _none_; Start command: `gunicorn server.app:app`  
4. Set `FLASK_ENV=production` in Env

---

## 📖 Usage

- **Sign up** or **Login**  
- **Browse** or **search** by location, category, new/resale/barter  
- **List** item for sale (new/resale) or barter  
- **Chat** in-app to negotiate  
- **Earn** tokens, badges, referrals  
- **Attend** community events & swap meets  
- **Track** wallet balance & trade history  
- **Admin** section for moderation & analytics

---

## 🤝 Contributing

1. Fork & clone  
2. Create feature branch  
3. Make changes & add tests  
4. Submit PR for review

---

## 📝 License

MIT © [NANNINGA SOFTWARE]

---

> _Built with ❤️ for stronger local communities and a sustainable circular economy._  