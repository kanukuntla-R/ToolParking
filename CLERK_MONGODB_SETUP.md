# Clerk + MongoDB Setup Guide

## Overview

Your Tool Parking app has been upgraded to use:
- **Clerk** for authentication (secure, production-ready)
- **MongoDB** for database (scalable, cloud-native)

## Quick Start

### 1. Set Up Clerk

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application
3. Go to **API Keys** section
4. Copy your keys to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx...
   CLERK_SECRET_KEY=sk_test_xxx...
   ```
5. Configure OAuth providers (GitHub, Google, etc.) in Clerk dashboard

### 2. Set Up MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended)**

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Update `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tool-parking
   ```

**Option B: Local MongoDB**

1. Install MongoDB locally
2. Update `.env.local`:
   ```
   MONGODB_URI=mongodb://localhost:27017/tool-parking
   ```

### 3. Run the App

```bash
npm run dev
```

Visit `http://localhost:3000` - you'll be redirected to sign-in.

## What Changed

### Authentication Flow

**Before:**
- Mock auth with hardcoded user
- No real security
- localStorage only

**After:**
- Clerk authentication
- Real user accounts
- Secure sessions
- MongoDB persistence

### Database

**Before:**
- localStorage (browser only)
- No persistence across devices
- No multi-user support

**After:**
- MongoDB (cloud database)
- Data persists forever
- Multi-user support
- Scalable

### Security

**Before:**
- No real auth
- No rate limiting
- No ownership verification

**After:**
- Clerk auth middleware
- Rate limiting (100 req/15min)
- User ownership verification
- Security headers

## File Structure

```
src/
├── app/
│   ├── sign-in/          # Clerk sign-in page
│   ├── sign-up/          # Clerk sign-up page
│   └── api/              # API routes (protected by Clerk)
── models/               # MongoDB models
│   ├── Tool.ts
│   ├── Project.ts
│   └── StackItem.ts
├── server/
│   ├── services/
│   │   └── database.ts   # MongoDB operations
│   └── middleware/
│       └── index.ts      # Clerk auth + rate limiting
└── lib/
    ├── mongodb.ts        # MongoDB connection
    └── clerk-config.ts   # Clerk configuration
```

## API Endpoints

All endpoints now require Clerk authentication:

| Endpoint | Method | Auth Required |
|----------|--------|---------------|
| `/api/tools` | GET | ✅ |
| `/api/tools` | POST | ✅ |
| `/api/tools/[id]` | GET | ✅ |
| `/api/tools/[id]` | PUT | ✅ |
| `/api/tools/[id]` | DELETE | ✅ |
| `/api/projects` | GET | ✅ |
| `/api/projects` | POST | ✅ |
| `/api/projects/[id]` | GET | ✅ |
| `/api/projects/[id]` | PUT | ✅ |
| `/api/projects/[id]` | DELETE | ✅ |
| `/api/stack` | GET | ✅ |
| `/api/stack` | POST | ✅ |
| `/api/stack/[id]` | PUT | ✅ |
| `/api/stack/[id]` | DELETE | ✅ |
| `/api/seed` | POST | ✅ |

## Environment Variables

See `.env.example` for all available variables.

Required:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `MONGODB_URI`

## Testing

### 1. Test Authentication
- Visit `/sign-in` - should show Clerk sign-in form
- Sign in with email or OAuth
- Should redirect to `/app/parking`

### 2. Test Database
- Create a tool - should save to MongoDB
- Refresh page - data should persist
- Sign out and back in - data should still be there

### 3. Test API
```bash
# Get your session token from browser cookies
# Then test API:
curl http://localhost:3000/api/tools \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Clerk Issues

**Problem:** "Invalid publishable key"
- Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env.local`
- Make sure it starts with `pk_test_` or `pk_live_`

**Problem:** "Sign-in page not found"
- Make sure `src/app/sign-in/page.tsx` exists
- Check Clerk middleware configuration

### MongoDB Issues

**Problem:** "Connection failed"
- Check `MONGODB_URI` in `.env.local`
- For Atlas: Make sure IP is whitelisted
- For local: Make sure MongoDB is running

**Problem:** "Model compilation errors"
- Delete `.next` folder
- Run `npm run build` again

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `MONGODB_URI`
4. Deploy!

### Environment Variables in Production

Use **production** keys from Clerk:
- `pk_live_...` instead of `pk_test_...`
- `sk_live_...` instead of `sk_test_...`

## Migration from localStorage

Your existing localStorage data won't automatically migrate to MongoDB. To migrate:

1. Export data from browser localStorage
2. Use the seed API to create default tools
3. Manually recreate your custom tools

Or keep using localStorage for development and MongoDB for production.

## Next Steps

1. ✅ Set up Clerk account
2. ✅ Set up MongoDB Atlas
3. ✅ Update `.env.local` with real keys
4. ✅ Test authentication flow
5. ✅ Test database operations
6. ✅ Deploy to production

## Support

- Clerk Docs: https://clerk.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Next.js Docs: https://nextjs.org/docs

---

**Status:** Ready for production! 🚀
