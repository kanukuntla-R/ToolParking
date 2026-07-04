# Appwrite Setup Guide

## 1. Create a project
Go to https://cloud.appwrite.io → New project → name it `tool-parking`

Copy your **Project ID** and paste it in `.env.local`

---

## 2. Create a Database
Databases → Create database
- Name: `Tool Parking DB`
- ID: `tool_parking_db`  ← paste this into .env.local

---

## 3. Create Collections

### Collection: `tools`
ID: `tools`

**Attributes:**
| Key         | Type       | Required | Default |
|-------------|------------|----------|---------|
| name        | String 100 | ✓        |         |
| description | String 300 | ✗        |         |
| category    | String 50  | ✓        |         |
| url         | String 500 | ✗        |         |
| icon        | String 10  | ✓        | ⬤       |
| color       | String 20  | ✓        | #6366f1 |
| tags        | String 500 | ✗        |         |
| userId      | String 100 | ✓        |         |
| isPublic    | Boolean    | ✓        | false   |

**Indexes:**
- `userId` — Key index
- `isPublic` — Key index

**Permissions:** Any user can read public docs; write is user-scoped (set per document via SDK)

---

### Collection: `projects`
ID: `projects`

**Attributes:**
| Key         | Type       | Required |
|-------------|------------|----------|
| name        | String 100 | ✓        |
| description | String 300 | ✗        |
| userId      | String 100 | ✓        |
| color       | String 20  | ✓        |

**Indexes:**
- `userId` — Key index

---

### Collection: `stack_items`
ID: `stack_items`

**Attributes:**
| Key       | Type       | Required |
|-----------|------------|----------|
| projectId | String 100 | ✓        |
| toolId    | String 100 | ✓        |
| lane      | String 50  | ✓        |
| order     | Integer    | ✓        |
| userId    | String 100 | ✓        |

**Indexes:**
- `projectId` — Key index
- `userId` — Key index

---

## 4. Auth settings
Authentication → Settings:
- Enable **Email/Password**
- Enable **GitHub OAuth** (add your GitHub OAuth app credentials)

For GitHub OAuth:
1. GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
2. Homepage URL: `https://your-app.vercel.app`
3. Callback URL: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/YOUR_PROJECT_ID`

---

## 5. .env.local
Copy `.env.local.example` to `.env.local` and fill in your values:
```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=tool_parking_db
NEXT_PUBLIC_APPWRITE_TOOLS_COLLECTION_ID=tools
NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID=projects
NEXT_PUBLIC_APPWRITE_STACK_ITEMS_COLLECTION_ID=stack_items
```

---

## 6. Deploy to Vercel
```bash
npm install
npm run dev          # test locally first

# Deploy
npx vercel           # follow prompts, add env vars in Vercel dashboard
```

Add all your `.env.local` variables to Vercel → Project → Settings → Environment Variables

---

## 7. Appwrite Platform setting
In Appwrite → your project → Settings → Platforms:
- Add a Web platform
- Hostname: `localhost` (for dev)
- Hostname: `your-app.vercel.app` (for production)
