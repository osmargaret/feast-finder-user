# Quick Deploy Script for Feast Finder Admin

## One-Command Deployment

### Using Vercel CLI
```bash
# 1. Install Vercel globally (if not installed)
npm install -g vercel

# 2. Navigate to admin directory
cd feast-finder-admin

# 3. Install dependencies
npm install

# 4. Test build locally (optional but recommended)
npm run build

# 5. Deploy to Vercel
vercel --prod
```

---

## Pre-Flight Check (5 min)

### ✅ Verify
- [ ] `npm run build` succeeds locally (creates `dist/`)
- [ ] No console errors on `npm run dev`
- [ ] `.env.example` reviewed — know your env vars
- [ ] Git repo initialized (for Vercel Git integration)

### 🔑 Environment Variables (Set in Vercel Dashboard)
| Key | Value | Required |
|---|---|---|
| `VITE_API_URL` | Your API endpoint | Yes |
| `VITE_AUTH_SECRET` | Auth secret (random string) | Yes |
| `VITE_APP_URL` | `https://admin.feastfinder.com` | No |

---

## 🎯 Deployment Methods

### Method 1: Vercel CLI (Fastest)
```bash
cd feast-finder-admin
vercel login
vercel --prod
```
**Result**: `https://feast-finder-admin.vercel.app`

### Method 2: GitHub + Vercel Dashboard
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit — admin panel"
git remote add origin https://github.com/YOUR_USER/feast-finder-admin.git
git push -u origin main
```
Then:
1. Go to https://vercel.com/new
2. Import GitHub repo
3. Configure env vars
4. Deploy

---

## 📋 Post-Deploy Checklist

- [ ] Visit deployed URL — should see login page
- [ ] Login (any email/password works in mock auth)
- [ ] Navigate all menus — no 404s
- [ ] Check console for errors in production build
- [ ] Set up custom domain (optional)
- [ ] Add environment variables in Vercel dashboard
- [ ] Enable Vercel Analytics (optional)
- [ ] Configure automatic deployments from Git

---

## 🔗 Useful Commands

```bash
# Local dev
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Check TypeScript types
npx tsc --noEmit

# Lint code
npm run lint

# Deploy with Vercel CLI
vercel          # preview deploy
vercel --prod   # production deploy

# Vercel management
vercel ls                        # list projects
vercel logs feast-finder-admin   # view logs
vercel alias set admin.feastfinder.com  # custom domain
```

---

## 🚨 Troubleshooting

### Build fails with "Cannot find module '@/...'"
→ Ensure `vite.config.ts` path alias is correct (already configured)

### Routes 404 on refresh
→ Vercel's Vite SPA handling should fix; ensure `vercel.json` has `"cleanUrls": true`

### Blank page after deploy
→ Check browser console; likely JS error. Run `npm run build` locally and preview to catch.

### Env vars not available
→ Set in Vercel Dashboard → Project Settings → Environment Variables, then redeploy.

### CSS not loading
→ Ensure `index.html` loads `/assets/index-*.css` correctly; Vite handles automatically.

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vite on Vercel**: https://vercel.com/templates/vite
- **Run locally first**: `npm run dev` → `npm run build` → `npm run preview`

---

**Ready? Deploy now:**
```bash
cd feast-finder-admin && vercel --prod
```
