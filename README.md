# 🅿️ Tool Parking

A personal library for all your dev tools, open-source projects, and services — with a drag-and-drop project stack builder.

## Features
- **Tool parking lot** — browse, filter, search your saved tools
- **Add any tool** — name, icon, color, category, tags, URL
- **Projects** — create projects and drag tools from parking into tech stack lanes
- **Auto-sorted lanes** — Frontend, Backend, Database, DevOps, Auth
- **Auth** — Clerk-powered sign-in and user sessions
- **Optimistic UI** — instant feedback, syncs to PocketBase through API routes

## Stack
- **Next.js 15** (App Router)
- **PocketBase** (self-hosted database)
- **Clerk** (authentication)
- **@dnd-kit** (drag and drop)
- **Zustand** (client state + optimistic updates)
- **TanStack Query** (server sync + caching)
- **Tailwind CSS**
- **Vercel** (deployment)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# fill in your values

# 3. Start PocketBase (see PocketBase Setup below)

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## PocketBase Setup

1. [Download PocketBase](https://pocketbase.io/docs/) and extract it.
2. Start the server:
   ```bash
   ./pocketbase serve
   ```
3. Open the admin UI at `http://127.0.0.1:8090/_/` and create an admin account.
4. Create the following collections in the PocketBase admin UI:

### Collections

**tools**
| Field | Type | Required |
|-------|------|----------|
| name | text | yes |
| description | text | no |
| categories | json | no |
| url | url | no |
| icon | text | no |
| color | text | no |
| tags | json | no |
| userId | text | yes |
| isPublic | bool | no |
| isDefault | bool | no |

Indexes:

```sql
CREATE UNIQUE INDEX idx_tools_user_name ON tools (userId, name COLLATE NOCASE)
```

**projects**
| Field | Type | Required |
|-------|------|----------|
| name | text | yes |
| description | text | no |
| color | text | no |
| notes | text | no |
| userId | text | yes |

**stack_items**
| Field | Type | Required |
|-------|------|----------|
| projectId | text | yes |
| toolId | text | yes |
| lane | text | yes |
| order | number | yes |
| userId | text | yes |

Index:

```sql
CREATE UNIQUE INDEX idx_stack_project_tool ON stack_items (projectId, toolId)
```

5. Set the env vars in `.env.local`:
   ```
   POCKETBASE_URL=http://127.0.0.1:8090
   POCKETBASE_ADMIN_EMAIL=your-admin-email
   POCKETBASE_ADMIN_PASSWORD=your-admin-password
   ```

## Deploy
```bash
npx vercel
```
Add env vars in Vercel dashboard → Project Settings → Environment Variables.
