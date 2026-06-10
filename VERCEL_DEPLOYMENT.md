# Vercel Deployment Configuration

## Environment Variables for Vercel

Add these environment variables to your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
ADMIN_PASSWORD=lmbmadan7
NEXT_PUBLIC_LEAGUE_ID=default
NEXT_PUBLIC_LEAGUE_NAME=World Cup Draft Pool
```

## Quick Deployment Steps

### 1. Make sure all code is committed and pushed to GitHub

```bash
git add .
git commit -m "Final MVP version 1 - production ready"
git push origin main
```

### 2. Go to Vercel and create new project

- Visit https://vercel.com/dashboard
- Click "Add New..." → "Project"
- Select "Import Git Repository"
- Search for "world-cup-draft-pool"
- Click "Import"

### 3. Add Environment Variables

In the "Environment Variables" section, add:

| Key | Value |
|-----|-------|
| NEXT_PUBLIC_SUPABASE_URL | (from Supabase Settings → API) |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | (from Supabase Settings → API) |
| SUPABASE_SERVICE_KEY | (from Supabase Settings → API) |
| ADMIN_PASSWORD | lmbmadan7 |
| NEXT_PUBLIC_LEAGUE_ID | default |
| NEXT_PUBLIC_LEAGUE_NAME | World Cup Draft Pool |

### 4. Deploy

Click "Deploy"

Vercel will:
- Build your Next.js app
- Run tests
- Deploy to production
- Give you a live URL

### 5. Access Your App

Your app will be live at:
```
https://world-cup-draft-pool.vercel.app
```

(Vercel may assign a different subdomain if that's taken)

## Post-Deployment

### Verify Everything Works

1. Visit your deployed URL
2. Go to `/admin` and login with password: `lmbmadan7`
3. Check Admin Panel loads
4. Visit `/draft-board`, `/teams`, `/leaderboard`, etc.

### Set Up Custom Domain (Optional)

In Vercel dashboard:
1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS instructions

### Monitor Deployments

- Every push to `main` automatically redeploys
- View logs in Vercel dashboard
- Check analytics and performance

## If Deployment Fails

### Common Issues

**Build Error:**
- Check Node version (should be 18+)
- Verify all dependencies installed
- Check TypeScript errors: `npm run type-check`

**Database Connection Error:**
- Verify Supabase URL and keys in environment variables
- Check Supabase project is active
- Run migrations: `npm run db:push`

**Admin Login Not Working:**
- Verify `ADMIN_PASSWORD` env var is set to `lmbmadan7`
- Check browser cookies are enabled

### Debug

```bash
# Test locally first
npm run build
npm run start

# Check environment variables
echo $ADMIN_PASSWORD
```

## Sharing With Friends

Your deployed URL is:
```
https://world-cup-draft-pool.vercel.app
```

Share this with your 5 other league members:
- They can view `/teams`, `/leaderboard`, `/rules`, `/payouts`
- Only you (admin) can access `/admin` with password `lmbmadan7`
- Everyone sees live updates as you manage the draft
