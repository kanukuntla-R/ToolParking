# Tool Parking - Complete Project Documentation

## 🚀 Overview

**Tool Parking** is a modern web application that helps developers organize, track, and manage their development tools, libraries, and services. Think of it as a personal library where you can "park" tools you use, categorize them, and assign them to different projects.

### Key Features
-  **Tool Management** - Add, edit, and organize development tools
- ️ **Multi-Category Support** - Tools can belong to multiple categories (e.g., Supabase = Database + Auth + Backend)
- 📊 **Project Stack Builder** - Create projects and assign tools to different layers (Frontend, Backend, Database, etc.)
- 📝 **Markdown Notes** - Write and save project documentation with live preview
-  **Theme Support** - Dark/Light mode with accent color customization
- 🔐 **Secure Authentication** - Google OAuth and email/password via Clerk
- 💾 **Cloud Database** - MongoDB Atlas for persistent, scalable storage

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with SSR/SSG | 15.5.15 |
| **React** | UI library | 19.0.0 |
| **TypeScript** | Type-safe JavaScript | 5.x |
| **Tailwind CSS** | Utility-first CSS framework | 3.4.0 |
| **Zustand** | Lightweight state management | 5.0.0 |
| **@dnd-kit** | Drag and drop library | 6.1.0 |
| **Lucide React** | Icon library | 0.460.0 |
| **Geist Font** | Typography (Vercel's font) | 1.7.0 |

### Backend & Infrastructure
| Technology | Purpose | Version |
|------------|---------|---------|
| **Clerk** | Authentication & User Management | 6.39.5 |
| **MongoDB** | NoSQL Database | via Mongoose 8.24.1 |
| **Mongoose** | MongoDB ODM | 8.24.1 |

### Development Tools
| Technology | Purpose |
|------------|---------|
| **ESLint** | Code linting |
| **PostCSS** | CSS processing |
| **Autoprefixer** | CSS vendor prefixes |

---

## 📁 Project Structure

```
tool-parking/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes (Backend)
│   │   │   ├── tools/         # Tool CRUD endpoints
│   │   │   ├── projects/      # Project CRUD endpoints
│   │   │   ├── stack/         # Stack item endpoints
│   │   │   ── seed/          # Seed default tools
│   │   ├── app/               # Protected app pages
│   │   │   ├── parking/       # Tool parking lot page
│   │   │   ├── projects/      # Projects & stack builder
│   │   │   └── settings/      # User settings
│   │   ├── sign-in/           # Clerk sign-in page
│   │   ├── sign-up/           # Clerk sign-up page
│   │   ├── layout.tsx         # Root layout with ClerkProvider
│   │   ── page.tsx           # Landing page
│   │
│   ├── components/            # React Components
│   │   ├── layout/            # Layout components (Providers)
│   │   ├── parking/           # Tool-related components
│   │   ├── projects/          # Project-related components
│   │   └── ui/                # Reusable UI components
│   │
│   ├── server/                # Backend Logic
│   │   ├── services/          # Business logic (DatabaseService)
│   │   ├── middleware/        # Auth, rate limiting, security
│   │   ├── validators/        # Input validation
│   │   ├── controllers/       # Request handlers
│   │   └── config/            # Server configuration
│   │
│   ├── models/                # MongoDB Schemas
│   │   ├── Tool.ts            # Tool model
│   │   ├── Project.ts         # Project model
│   │   └── StackItem.ts       # Stack item model
│   │
│   ├── lib/                   # Utilities & Helpers
│   │   ├── api.ts             # API client
│   │   ├── db.ts              # Database wrapper
│   │   ├── mongodb.ts         # MongoDB connection
│   │   ├── auth.ts            # Authentication helpers
│   │   ├── logger.ts          # Logging utility
│   │   ├── seed-data.ts       # Default tools data
│   │   └── utils.ts           # General utilities
│   │
│   ├── store/                 # Zustand State Management
│   │   └── index.ts           # Global state
│   │
│   ├── types/                 # TypeScript Types
│   │   └── index.ts           # Type definitions
│   │
│   └── middleware.ts          # Clerk middleware (auth routes)
│
├── public/                    # Static assets
── .env.local                 # Environment variables (gitignored)
├── .env.example               # Environment template
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript config
└── next.config.js             # Next.js config
```

---

## 🎨 Frontend Architecture

### Pages & Routing

The app uses Next.js App Router with the following structure:

```
/                      → Landing page (redirects to sign-in)
/sign-in               → Clerk sign-in page
/sign-up               → Clerk sign-up page
/app/parking           → Tool parking lot (protected)
/app/projects          → Project stack builder (protected)
/app/settings          → User settings (protected)
```

### State Management (Zustand)

The app uses **Zustand** for global state management. The store is defined in `src/store/index.ts`:

```typescript
interface AppStore {
  // Authentication
  user: AppUser | null
  
  // Tools
  tools: Tool[]
  
  // Projects
  projects: Project[]
  
  // Active project stack
  stackItems: StackItem[]
  
  // UI State
  searchQuery: string
  activeFilter: string
  activeProject: string | null
}
```

**Why Zustand?**
- Lightweight (1KB vs Redux's 7KB)
- No boilerplate
- TypeScript-first
- Works great with React Server Components

### Component Architecture

#### Layout Components
- **`Providers.tsx`** - Wraps app with QueryClient and auth bootstrap
- **`AppLayout.tsx`** - Main app layout with sidebar navigation

#### Page Components
- **`ParkingPage`** - Displays all tools in a grid with filtering
- **`ProjectsPage`** - Project selector + stack builder with drag-and-drop
- **`SettingsPage`** - Profile, appearance, and data management

#### Feature Components
- **`ToolCard`** - Individual tool display with drag support
- **`AddToolModal`** - Form to add/edit tools
- **`CategoryToolPanel`** - Collapsible category list for adding tools to projects
- **`StackLane`** - Drop zone for tools in project stack
- **`MarkdownEditor`** - Notes editor with preview

### Styling Approach

**Tailwind CSS** with custom theme:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      surface: { /* Dark theme colors */ },
      accent: { /* Green accent (#22c55e) */ }
    },
    fontFamily: {
      sans: ['Geist Mono', 'monospace'],
      mono: ['Geist Mono', 'monospace']
    }
  }
}
```

**Design System:**
- **Monospace font** throughout (Geist Mono)
- **Glass morphism** effects with `backdrop-filter`
- **Green accent** (#22c55e) for primary actions
- **Dark theme** by default with light theme support

---

## ⚙️ Backend Architecture

### API Routes (Next.js API)

All backend logic lives in `src/app/api/` as Next.js API routes:

```
POST   /api/seed              → Seed default tools
GET    /api/tools             → List user's tools
POST   /api/tools             → Create tool
GET    /api/tools/[id]        → Get tool by ID
PUT    /api/tools/[id]        → Update tool
DELETE /api/tools/[id]        → Delete tool
GET    /api/projects          → List user's projects
POST   /api/projects          → Create project
GET    /api/projects/[id]     → Get project by ID
PUT    /api/projects/[id]     → Update project
DELETE /api/projects/[id]     → Delete project
GET    /api/stack?projectId=  → List stack items
POST   /api/stack             → Add tool to stack
PUT    /api/stack/[id]        → Update stack item
DELETE /api/stack/[id]        → Remove from stack
```

### Request Flow

```
Client Request
    ↓
Clerk Middleware (src/middleware.ts)
    ↓ Auth check
API Route Handler
    ↓
Security Headers + Rate Limiting
    ↓
Controller (validation)
    ↓
Service (business logic)
    ↓
MongoDB (via Mongoose)
    ↓
Response
```

### Middleware Layer

**`src/middleware.ts`** - Clerk authentication middleware:
- Protects all routes except `/`, `/sign-in`, `/sign-up`, `/api/seed`
- Redirects unauthenticated users to sign-in
- Passes `userId` to API routes

**`src/server/middleware/index.ts`**:
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Security Headers**: XSS protection, frame options, HSTS
- **Auth Helper**: Extracts userId from Clerk session

### Service Layer

**`DatabaseService`** (`src/server/services/database.ts`):
- All database operations
- User ownership verification
- Data transformation (MongoDB → TypeScript types)
- Connection pooling via Mongoose

### Validation

**`src/server/validators/index.ts`**:
- Input validation for tools, projects, stack items
- Type checking and format validation
- Returns structured error messages

---

## 🗄️ Database Schema

### MongoDB Models

#### Tool Model
```typescript
interface ITool {
  userId: string          // Clerk user ID
  name: string            // Tool name (required)
  description: string     // Description
  categories: string[]    // Multi-category support
  url: string             // Website URL
  icon: string            // Favicon URL
  color: string           // Brand color (hex)
  tags: string[]          // Custom tags
  isPublic: boolean       // Share with others
  isDefault: boolean      // Seeded default tool
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**
- `{ userId: 1, isPublic: 1 }` - Fast user/public queries
- `{ name: 'text', description: 'text', tags: 'text' }` - Full-text search

#### Project Model
```typescript
interface IProject {
  userId: string
  name: string
  description: string
  color: string
  notes: string           // Markdown notes
  createdAt: Date
  updatedAt: Date
}
```

#### StackItem Model
```typescript
interface IStackItem {
  userId: string
  projectId: string       // Reference to Project
  toolId: string          // Reference to Tool
  lane: string            // Frontend | Backend | Database | DevOps | Auth | Other
  order: number           // Sort order within lane
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**
- `{ projectId: 1, order: 1 }` - Fast lane queries
- `{ userId: 1, projectId: 1 }` - User project queries

### Connection Management

**`src/lib/mongodb.ts`**:
- Singleton connection pattern
- Prevents multiple connections in development
- Graceful error handling
- Connection caching

---

## 🔐 Authentication Flow

### Clerk Integration

**Setup:**
1. User visits protected route
2. Clerk middleware checks session
3. If no session → redirect to `/sign-in`
4. User signs in with Google or email/password
5. Clerk sets session cookie
6. User redirected back to app

**Session Handling:**
```typescript
// In API routes
const { userId } = await auth()
if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
```

**OAuth (Google Login):**
1. User clicks "Continue with Google"
2. Redirects to Google OAuth
3. Google redirects to `/sign-in/sso-callback`
4. Clerk processes callback
5. Session created
6. Redirected to `/app/parking`

### Security Measures

✅ **Authentication** - Clerk with OAuth support  
✅ **Authorization** - User ownership verification on all operations  
✅ **Rate Limiting** - 100 requests per 15 minutes  
✅ **Input Validation** - All API inputs validated  
✅ **Security Headers** - XSS, frame, HSTS protection  
✅ **Data Sanitization** - String trimming, format validation  

---

## 🎯 Key Features Explained

### 1. Tool Parking Lot

**Location:** `/app/parking`

**How it works:**
- Fetches all tools from MongoDB (user's + public)
- Displays in responsive grid (1-3 columns)
- Filter by category (Frontend, Backend, etc.)
- Search by name, description, or tags
- "Mine" filter shows only user-created tools
- Drag-and-drop reordering (local only)
- Edit/delete tools (owner only)

**Components:**
- `ParkingPage` - Main page logic
- `ToolCard` - Individual tool display
- `AddToolModal` - Create/edit form
- `CategoryToolPanel` - Collapsible category browser

### 2. Project Stack Builder

**Location:** `/app/projects`

**How it works:**
- Create projects with name, description, color
- Drag tools from left panel to stack lanes
- 6 lanes: Frontend, Backend, Database, DevOps, Auth, Other
- Auto-assign lane based on tool category
- Reorder within lanes via drag-and-drop
- Write markdown notes for each project
- Export project as `.md` file

**Components:**
- `ProjectsPage` - Main orchestrator
- `StackLane` - Drop zone for tools
- `CategoryToolPanel` - Tool browser
- `MarkdownEditor` - Notes with preview

**Drag & Drop Flow:**
```
1. User drags tool from CategoryToolPanel
2. DndContext tracks drag state
3. User drops on StackLane
4. handleDragEnd validates drop
5. Creates StackItem in MongoDB
6. Updates UI optimistically
```

### 3. Multi-Category Tools

**Problem:** Tools like Supabase are Database + Auth + Backend

**Solution:**
- `categories: string[]` instead of single `category`
- Tool appears in all assigned categories
- Filter shows tool in multiple sections
- Badge display shows all categories

**Example:**
```typescript
{
  name: 'Supabase',
  categories: ['database', 'auth', 'backend'],
  // Shows in Database, Auth, and Backend filters
}
```

### 4. Theme System

**Features:**
- Dark mode (default)
- Light mode
- System preference detection
- Accent color picker (7 presets + custom)
- Persists to localStorage

**Implementation:**
```typescript
// ThemeSwitcher component
- Toggles 'light' class on <html>
- CSS variables change based on class
- Tailwind uses CSS variables for colors
```

### 5. Default Tools Seeding

**How it works:**
1. User signs in for first time
2. Frontend calls `POST /api/seed`
3. Backend checks if user has tools
4. If not, inserts ~100 default tools
5. Tools marked with `isDefault: true`
6. User can delete or customize

**Default Tools Include:**
- Languages: JavaScript, TypeScript, Python, Go, Rust, etc.
- Databases: PostgreSQL, MongoDB, Redis, etc.
- Frameworks: React, Next.js, Vue, etc.
- DevOps: Docker, Kubernetes, AWS, etc.

---

##  Development Workflow

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Clerk and MongoDB keys

# 3. Start development server
npm run dev

# 4. Open browser
http://localhost:3000
```

### Environment Variables

```env
# Clerk (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# MongoDB (Required)
MONGODB_URI=mongodb+srv://...

# Optional
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 🌐 Deployment

### Vercel (Recommended)

**Why Vercel?**
- Built by Next.js creators
- Zero-config deployment
- Automatic HTTPS
- Edge functions
- Free tier available

**Steps:**
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `MONGODB_URI`
4. Deploy!

**Clerk Production Keys:**
- Switch from `pk_test_` to `pk_live_`
- Switch from `sk_test_` to `sk_live_`
- Add production URL to Clerk allowed origins

### MongoDB Atlas

**Free Tier (M0):**
- 512 MB storage
- Shared RAM
- Perfect for development

**Production Considerations:**
- Upgrade to M10+ for production
- Enable backups
- Set up monitoring
- Configure IP whitelist

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Sign up with email
- [ ] Sign up with Google
- [ ] Sign in after sign out
- [ ] Create a tool
- [ ] Edit a tool
- [ ] Delete a tool
- [ ] Filter tools by category
- [ ] Search tools
- [ ] Create a project
- [ ] Add tools to project stack
- [ ] Drag tools between lanes
- [ ] Write project notes
- [ ] Export project as markdown
- [ ] Change theme (dark/light)
- [ ] Change accent color
- [ ] Test on mobile viewport

### API Testing

```bash
# Get all tools
curl http://localhost:3000/api/tools

# Create a tool (requires auth cookie)
curl -X POST http://localhost:3000/api/tools \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Tool","categories":["other"]}'
```

---

## 📊 Performance

### Metrics

| Metric | Value |
|--------|-------|
| Build Time | ~2 seconds |
| First Load JS | 102 kB (shared) |
| Page Size | 6-11 kB per page |
| API Response | <100ms (localhost) |
| MongoDB Query | <50ms (Atlas) |

### Optimizations

✅ **Next.js SSG/SSR** - Fast page loads  
✅ **Image Optimization** - Automatic WebP conversion  
✅ **Code Splitting** - Per-page bundles  
✅ **Font Optimization** - Self-hosted Geist font  
✅ **CSS Purging** - Tailwind removes unused styles  

---

## 🔮 Future Enhancements

### Planned Features

- [ ] **Real-time Collaboration** - Share projects with team
- [ ] **Tool Recommendations** - AI-suggested tools based on stack
- [ ] **Import/Export** - Backup and restore data
- [ ] **Tool Reviews** - Rate and review tools
- [ ] **Project Templates** - Pre-built tech stacks
- [ ] **Analytics** - Track tool usage
- [ ] **Mobile App** - React Native version
- [ ] **Browser Extension** - Quick-add tools from any website

### Technical Improvements

- [ ] **Redis Caching** - Faster API responses
- [ ] **Comprehensive Tests** - Jest + React Testing Library
- [ ] **CI/CD Pipeline** - Automated testing and deployment
- [ ] **Monitoring** - Sentry for error tracking
- [ ] **Database Indexes** - Optimize slow queries
- [ ] **API Documentation** - Swagger/OpenAPI spec

---

## 🤝 Contributing

### Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Following Next.js rules
- **Prettier** - Auto-formatting
- **Conventional Commits** - `feat:`, `fix:`, `docs:`, etc.

### Branch Strategy

```
main          → Production-ready code
develop       → Integration branch
feature/*     → New features
bugfix/*      → Bug fixes
```

---

## 📚 Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Clerk Docs](https://clerk.com/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)

### Project Files

- `BACKEND_ARCHITECTURE.md` - Backend design decisions
- `CLERK_MONGODB_SETUP.md` - Setup guide
- `.env.example` - Environment variables template

---

## 📝 License

This project is private and proprietary.

---

## 👤 Author

Built with ❤️ using Next.js, Clerk, and MongoDB.

**Last Updated:** July 2026
