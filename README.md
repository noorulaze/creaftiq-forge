# CREAFTIQ FORGE

> **Turn an idea into a digital launch plan.**

CREAFTIQ FORGE is an AI-powered creative workspace. Drop a raw idea — FORGE understands it, strategizes it, and generates a complete digital launch blueprint across brand, product, website, content, marketing, and roadmap.

---

## Tech Stack

| Layer        | Technology                          |
|---|---|
| Frontend     | React 18 + TypeScript + Vite        |
| Styling      | Tailwind CSS v3 + custom FORGE tokens |
| Animation    | Framer Motion                        |
| State        | Zustand                              |
| Auth         | Firebase Authentication              |
| Database     | Cloud Firestore                      |
| AI Backend   | Firebase Cloud Functions + Gemini API |
| Hosting      | Firebase Hosting                     |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project (create at [console.firebase.google.com](https://console.firebase.google.com))

### 1. Install frontend dependencies
```bash
npm install
```

### 2. Configure Firebase
Copy `.env.example` to `.env.local` and fill in your Firebase config values from the Firebase Console → Project Settings → Your Apps.

```bash
cp .env.example .env.local
```

Enable **Email/Password** authentication in Firebase Console → Authentication → Sign-in method.

### 3. Install Functions dependencies
```bash
cd functions && npm install && cd ..
```

### 4. Configure Gemini API Key (for production)
```bash
# Replace with your actual key from Google AI Studio
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY" gemini.mock="false"
```

> **Without a key:** The app runs in mock mode by default (`gemini.mock=true`). You'll get realistic mock data instantly — no API key needed for development.

### 5. Run locally
```bash
# Terminal 1 — Firebase emulators
firebase emulators:start

# Terminal 2 — Vite dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
creaftiq-forge/
├── src/
│   ├── components/
│   │   ├── auth/         # Auth forms
│   │   ├── landing/      # Landing page sections
│   │   ├── layout/       # Navbar, AppShell, ProtectedRoute
│   │   ├── shared/       # Reusable UI components
│   │   └── workspace/    # Blueprint workspace components + tabs
│   ├── pages/            # Route-level page components
│   ├── services/         # Firebase, Auth, Firestore, AI service calls
│   ├── store/            # Zustand state stores
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utilities (cn, etc.)
├── functions/            # Firebase Cloud Functions (AI calls)
│   └── src/
│       ├── ai/           # One function per AI operation
│       ├── prompts/      # Gemini prompt templates
│       └── utils/        # gemini client, mock data, validation
├── public/               # Static assets
├── firebase.json
├── firestore.rules
└── firestore.indexes.json
```

---

## AI Flow

```
User enters idea
       ↓
analyzeIdea()         → IdeaDNA + Readiness scores
       ↓ (parallel)
generateBrand()       → Brand names, taglines, visual direction
generateProduct()     → Core product, features, user journey
generateWebsite()     → Pages, sections, navigation, UX
generateContent()     → Pillars, posts, reels, campaigns
generateMarketing()   → Channels, strategy, action plan
generateRoadmap()     → NOW / NEXT / LATER milestones
generateCreativeDirection() → Color palette, mood, visual keywords
       ↓
saveProjectOutputs()  → Firestore
       ↓
WorkspacePage()       → 7-tab blueprint workspace
```

---

## Deployment

```bash
# Build frontend
npm run build

# Deploy everything (hosting + functions + firestore rules)
firebase deploy
```

---

## Security

- **Gemini API key is server-side only** — stored in Firebase Functions config, never in client code or environment variables
- Firestore rules enforce strict per-user data isolation
- All AI calls require authenticated Firebase session

---

**Built by CREAFTIQ**
