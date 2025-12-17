# Deployment Checklist ✈️

## Pre-Deployment Verification

### 1. Build Test

```bash
npm run build
```

✅ Should complete without errors
✅ Check for TypeScript errors
✅ Verify no console warnings

### 2. Production Test

```bash
npm start
```

✅ Navigate through all pages
✅ Test responsive design
✅ Verify no console errors

### 3. Environment Variables

```bash
cp .env.example .env
```

Optional: Add `OPENAI_API_KEY` if using OpenAI integration

## Vercel Deployment

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m \"Initial commit: AI Assist dashboard\"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js
   - Click "Deploy"

3. **Environment Variables** (Optional)
   - Settings → Environment Variables
   - Add `OPENAI_API_KEY` if needed

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

## Post-Deployment Checks

### ✅ Functional Testing

- [ ] Landing page loads
- [ ] Dashboard accessible
- [ ] Sidebar navigation works
- [ ] Mobile menu functions
- [ ] Search input responsive
- [ ] All routes load correctly

### ✅ Performance

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s

### ✅ Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] ARIA labels present

### ✅ Mobile Testing

- [ ] Responsive design correct
- [ ] Touch targets adequate (44x44px min)
- [ ] No horizontal scroll
- [ ] Readable text sizes

## Known Considerations

### Current Limitations

- ⚠️ No authentication (add in Stage 2+)
- ⚠️ Mock data only (real data in Stage 2+)
- ⚠️ Voice commands UI only (API integration in Stage 2)
- ⚠️ Chat interface not yet implemented

### Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Safari (latest)
- ✅ Firefox (latest)
- ⚠️ IE11 not supported

### SSR Safety

All client-only code properly wrapped:

- `'use client'` directives in place
- No window/document access during SSR
- State management client-side only

## Environment Variables Reference

```bash
# .env (create from .env.example)

# Optional: OpenAI API integration
OPENAI_API_KEY=sk-...

# Optional: Demo mode default
NEXT_PUBLIC_DEMO_MODE=true
```

## Monitoring Setup (Post-Deploy)

### Vercel Analytics

1. Enable in project settings
2. Monitor Core Web Vitals
3. Track user interactions

### Error Tracking (Optional)

- Sentry integration
- Error boundaries (add in Stage 2)

## Rollback Plan

```bash
# Revert to previous deployment
vercel rollback
```

## Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Settings → Domains
   - Add your domain
2. **Configure DNS**
   - Add CNAME or A record
   - Point to Vercel

## SSL/HTTPS

✅ Automatic with Vercel
✅ Free Let's Encrypt certificates
✅ Auto-renewal

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript Errors

```bash
npx tsc --noEmit
```

### Module Not Found

```bash
npm install
# Check import paths use @/ alias
```

## Success Criteria

✅ Green deployment status in Vercel
✅ All pages load without errors  
✅ Mobile responsive design works
✅ Lighthouse score > 85
✅ No console errors in production

---

**Ready to Deploy!** 🚀

Next: Test locally → Push to GitHub → Deploy to Vercel
