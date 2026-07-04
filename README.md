# 🅿️ Tool Parking

A personal library for all your dev tools, open-source projects, and services — with a drag-and-drop project stack builder.

## Features
- **Tool parking lot** — browse, filter, search your saved tools
- **Add any tool** — name, icon, color, category, tags, URL
- **Projects** — create projects and drag tools from parking into tech stack lanes
- **Auto-sorted lanes** — Frontend, Backend, Database, DevOps, Auth
- **Auth** — email/password + GitHub OAuth via Appwrite
- **Optimistic UI** — instant feedback, syncs to Appwrite in background

## Stack
- **Next.js 15** (App Router)
- **Appwrite** (auth, database, realtime)
- **@dnd-kit** (drag and drop)
- **Zustand** (client state + optimistic updates)
- **TanStack Query** (server sync + caching)
- **Tailwind CSS**
- **Vercel** (deployment)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set up Appwrite — see APPWRITE_SETUP.md
cp .env.local.example .env.local
# fill in your values

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy
```bash
npx vercel
```
Add env vars in Vercel dashboard → Project Settings → Environment Variables.

See `APPWRITE_SETUP.md` for the full Appwrite collection schema and auth config.
