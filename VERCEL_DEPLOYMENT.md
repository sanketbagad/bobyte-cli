# Vercel Deployment Guide

## Deploy Backend to Vercel

### Prerequisites
- Vercel account: https://vercel.com/signup
- Node.js 20.x or higher

### Step 1: Connect Repository

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository `bobyte-cli`
4. Select root directory: `/` (root)

### Step 2: Environment Variables

Add these environment variables in Vercel:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL URL |
| `BETTER_AUTH_SECRET` | Your secret key |
| `BETTER_AUTH_URL` | https://yourdomain.vercel.app |
| `GH_CLIENT_ID` | Your GitHub OAuth ID |
| `GH_CLIENT_SECRET` | Your GitHub OAuth secret |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Google API key |
| `BOTBYTE_MODEL` | gemini-2.5-flash |
| `CLIENT_URL` | Your frontend URL |

### Step 3: Configure Build Settings

- **Build Command**: `cd server && npm run build`
- **Output Directory**: `server/dist`
- **Install Command**: `npm install`

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your backend will be available at: `https://your-project.vercel.app`

### Step 5: Update Frontend

Update `client/lib/auth-client.ts` with your Vercel API URL:

```typescript
export const authClient = createAuthClient({
  baseURL: "https://your-project.vercel.app",
});
```

### Step 6: Update GitHub OAuth

Update your GitHub OAuth app settings:
- **Authorization callback URL**: `https://your-project.vercel.app/api/auth/callback/github`

## Database Migrations

After deployment, run migrations:

```bash
npx prisma migrate deploy --skip-generate
```

Or use Vercel CLI:

```bash
vercel env pull
npx prisma migrate deploy
```

## Monitoring

Check logs in Vercel dashboard:
1. Go to your project
2. Click "Functions" tab
3. View logs for `api/index`

## Troubleshooting

**CORS errors**: Update `BETTER_AUTH_URL` and `CLIENT_URL` in environment variables

**Database connection**: Ensure `DATABASE_URL` has proper connection pooling enabled

**Build failures**: Check build logs in Vercel dashboard for detailed errors
