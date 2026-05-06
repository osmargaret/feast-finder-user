# Deploying Feast Finder Admin to Vercel

## 📦 Pre-Deployment Checklist

### 1. Verify Build Locally
```bash
cd feast-finder-admin
npm install
npm run build
```
Check that `dist/` folder is created without errors.

### 2. Environment Variables
Create `.env` file (not committed to git):
```bash
cp .env.example .env
```
Fill in actual values when you have a backend:
- `VITE_API_URL` — Your API endpoint
- `VITE_AUTH_SECRET` — Auth secret (JWT, etc.)
- `VITE_APP_URL` — Final deployed URL

Currently, all data is mock — no backend required for UI demo.

### 3. Fix Lint Errors
```bash
npm run lint
```
Fix any TypeScript/ESLint warnings before deploying.

---

## 🚀 Deploy to Vercel

### Option A: Via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not installed):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```
Follow the browser auth flow.

3. **Deploy from project folder**:
```bash
cd feast-finder-admin
vercel
```
- Follow prompts (set project name, scope)
- Choose "Production" deployment when asked
- Wait for build to complete

4. **Get your URL**:
```
✅  Production: https://feast-finder-admin.vercel.app
```

5. **Alias to custom domain** (optional):
```bash
vercel alias set feast-finder-admin.vercel.app admin.feastfinder.com
```

---

### Option B: Via Vercel Dashboard (Git Integration)

1. **Push code to GitHub** (if not already):
```bash
cd feast-finder-admin
git init
git add .
git commit -m "Initial commit — admin panel"
git remote add origin https://github.com/YOUR_USERNAME/feast-finder-admin.git
git push -u origin main
```

2. **Import project on Vercel**:
   - Go to https://vercel.com/new
   - Select your GitHub repo (`feast-finder-admin`)
   - Vercel auto-detects Vite + React

3. **Configure environment variables** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add:
     - `VITE_API_URL` → `https://api.feastfinder.com`
     - `VITE_AUTH_SECRET` → (your secret)
     - `NODE_ENV` → `production`

4. **Deploy**:
   - Click "Deploy"
   - Wait for build + deployment
   - Done! URL will be `https://feast-finder-admin.vercel.app`

---

## ⚙️ Vercel Configuration (`vercel.json`)

I've created `vercel.json` with these settings:

```json
{
  "build": {
    "outDir": "dist",
    "emptyOutDir": true,
    "installCommand": "npm install",
    "buildCommand": "npm run build"
  },
  "devCommand": "npm run dev",
  "framework": "vite",
  "functions": {
    "src/main.tsx": {
      "maxDuration": 10
    }
  },
  "regions": ["iad1"],
  "cleanUrls": true,
  "trailingSlash": false
}
```

**Key options**:
- `outDir: "dist"` — Vite build output
- `framework: "vite"` — tells Vercel to use Vite build
- `regions: ["iad1"]` — deploy to US East (Virginia) — change to your target region
- `cleanUrls: true` — removes `.html` extensions (SPA routing friendly)

---

## 🔧 Post-Deployment

### Custom Domain
1. In Vercel Dashboard → Project Settings → Domains
2. Add domain: `admin.feastfinder.com` (or your choice)
3. Update DNS:
   - Type: `CNAME`
   - Name: `admin`
   - Value: `cname.vercel-dns.com` (or provided by Vercel)

### Environment Variables in Production
Set in Vercel Dashboard:
```
VITE_API_URL=https://api.feastfinder.com
VITE_AUTH_SECRET=<secure-random-string>
VITE_APP_URL=https://admin.feastfinder.com
NODE_ENV=production
```

**Important**: Variables prefixed with `VITE_` are exposed to client-side code. Keep secrets server-side if you add backend functions later.

### SSL/HTTPS
Automatic on Vercel (free SSL cert).

---

## 🛠️ Common Issues & Fixes

### Issue: Build fails with "Cannot find module" for aliases
**Fix**: Ensure `vite.config.ts` has path alias:
```ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
```
Vercel respects Vite config automatically.

### Issue: SPA routes 404 on refresh
**Fix**: Already handled by Vercel's Vite integration — `cleanUrls` + SPA fallback works out of box. No `_redirects` needed.

### Issue: Missing environment variables at runtime
**Fix**: Set them in Vercel dashboard, not just locally. Re-deploy after adding.

### Issue: Assets not loading (images, fonts)
**Fix**: All assets should be imported in code (Vite handles). If using public folder, ensure they're in `public/`.

---

## 📊 Monitoring & logs

- **Build logs**: Vercel Dashboard → Deployments → View Build Log
- **Function logs**: If you add serverless functions later, check "Functions" tab
- **Analytics**: Vercel Analytics (add `@vercel/analytics` if desired)

---

## 🔄 CI/CD

Vercel auto-deploys on git push:
- `main` → production
- `preview` branches → preview URLs

Configure in Vercel Dashboard → Git + Project → Production Branch.

---

## 📁 Project Structure on Vercel

After build, Vercel serves:
```
dist/
├── index.html          # SPA entry
├── assets/
│   ├── *.js           # Bundled chunks
│   └── *.css          # Compiled Tailwind
└── ...
```

All routing handled client-side by React Router.

---

## 🎯 Quick Start (One-Liner)

```bash
cd feast-finder-admin && npm run build && vercel --prod
```

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Vite on Vercel: https://vercel.com/templates/vite
- Issue? Check `vercel --help` or Vercel dashboard logs

---

## ⚡ Next Steps After Deployment

1. Connect admin panel to real backend (REST/GraphQL)
2. Implement proper auth (Clerk, Supabase, NextAuth)
3. Add serverless API routes (if needed) in `/api` folder
4. Set up error monitoring (Sentry)
5. Add custom domain + SSL
6. Enable Vercel Analytics
7. Set up notifications (Slack/email on deploy)

---

**Your admin panel is now ready for Vercel!** 🎉
