# 🚀 QUICK START GUIDE - Content Migration
## Get Your New Landing Page Live in 5 Minutes

---

## ⚡ STEP 1: Apply Database Migration (2 minutes)

### Option A: Via Supabase Dashboard (Recommended)
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the content from:
   ```
   supabase/migrations/20260108210000_migrate_santa_cruz_content.sql
   ```
5. Click **Run**
6. Wait for success message: "✅ Content migration completed successfully!"

### Option B: Via Command Line
```bash
# If you have Supabase CLI installed
npx supabase db push
```

---

## ⚡ STEP 2: Publish the Content (30 seconds)

### Via Supabase Dashboard
1. Still in **SQL Editor**
2. Run this query:
```sql
UPDATE landing_pages SET status = 'published' WHERE slug = 'home';
```

### Verify it worked:
```sql
SELECT slug, status FROM landing_pages WHERE slug = 'home';
-- Should show: home | published
```

---

## ⚡ STEP 3: View Your New Landing Page (10 seconds)

1. Open your browser
2. Navigate to: `http://localhost:3000`
3. You should see the new modern landing page with all content from Clínica Veterinaria Santa Cruz!

---

## ⚡ STEP 4: Run Tests (Optional - 1 minute)

```bash
npx playwright test tests/landing-migration.spec.ts
```

Expected result: **17 tests passing** ✅

---

## 🎨 STEP 5: Replace Placeholder Images (Optional - 10 minutes)

### Current State
- All images are using professional Unsplash placeholders
- Page looks good but uses generic veterinary photos

### To Use Real Clinic Photos

#### Method 1: Via Admin Dashboard (Easiest)
1. Go to `http://localhost:3000/dashboard/admin/landing`
2. Click on each section (Hero, Services, About, etc.)
3. Upload your clinic photos
4. Click **Save**
5. Click **Publish**

#### Method 2: Via Supabase Storage
1. Go to Supabase Dashboard → **Storage**
2. Navigate to `landing-assets` bucket
3. Upload your images:
   - `logo.png` - Clinic logo
   - `hero-main.jpg` - Main hero image
   - `dra-pabon.jpg` - Photo of Dra. Pabón
   - `services/` folder - Service images
   - `products/cookies.jpg` - My Sweet Pet Cookies
4. Copy the public URLs
5. Update in Admin Dashboard or via SQL:

```sql
-- Example: Update hero image
UPDATE landing_sections 
SET content = jsonb_set(content, '{imageUrl}', '"YOUR_SUPABASE_URL_HERE"')
WHERE key = 'hero';
```

---

## ✅ VERIFICATION CHECKLIST

After completing the steps above, verify:

- [ ] Landing page loads at `http://localhost:3000`
- [ ] Hero section shows "Experiencia y Cariño al Servicio de tus Mascotas"
- [ ] Services section shows 9 services
- [ ] About section mentions Dra. Patricia Pabón
- [ ] Contact section shows phone 787-520-6080
- [ ] Header has "Portal Clientes" and "Agendar Cita" buttons
- [ ] Footer shows clinic information
- [ ] No "Lorem ipsum" or placeholder text
- [ ] Page is responsive on mobile

---

## 🆘 TROUBLESHOOTING

### Problem: Page shows old content
**Solution:** Clear browser cache or hard refresh (Ctrl+Shift+R)

### Problem: Content not showing
**Solution:** Make sure you published the content:
```sql
UPDATE landing_pages SET status = 'published' WHERE slug = 'home';
```

### Problem: Images not loading
**Solution:** Check if images are Unsplash placeholders (they should work). If using custom images, verify Supabase Storage bucket is public:
```sql
UPDATE storage.buckets SET public = true WHERE id = 'landing-assets';
```

### Problem: Tests failing
**Solution:** Make sure:
1. Dev server is running (`npm run dev`)
2. Content is published (see above)
3. Database migration was applied successfully

---

## 📊 WHAT YOU GET

### Content Migrated
- ✅ Brand name and tagline
- ✅ Hero section with Dra. Pabón info
- ✅ Trust badges (16+ years, licenses)
- ✅ 9 complete services
- ✅ 6 "Why Choose Us" features
- ✅ Full about section with achievements
- ✅ 4-step process
- ✅ My Sweet Pet Cookies product
- ✅ Drop Off service CTA
- ✅ Complete contact information
- ✅ Professional footer

### Design Features
- ✅ Modern, clean layout
- ✅ Fully responsive (mobile/tablet/desktop)
- ✅ Premium veterinary color scheme
- ✅ Smooth animations and hover effects
- ✅ Clear visual hierarchy
- ✅ Strategic CTA placement
- ✅ Trust elements throughout

### Technical Features
- ✅ No hardcoded content (all in Supabase)
- ✅ Dynamic rendering from CMS
- ✅ SEO-friendly semantic HTML
- ✅ Accessible components
- ✅ Fast page load times
- ✅ TypeScript type-safe

---

## 🎯 NEXT ACTIONS

### Immediate (Do Now)
1. ✅ Apply migration
2. ✅ Publish content
3. ✅ View new landing page

### Soon (This Week)
4. 📸 Replace placeholder images with real clinic photos
5. 🧪 Run Playwright tests
6. 📱 Test on real mobile devices

### Later (Optional)
7. 📊 Add Google Analytics
8. 🌟 Collect testimonials
9. 📝 Add blog section
10. 🔍 Optimize for SEO

---

## 📞 NEED HELP?

### Documentation
- Full migration plan: `.agent/CONTENT_MIGRATION_PLAN.md`
- Complete deliverables: `.agent/MIGRATION_DELIVERABLES.md`
- Database schema: `supabase/migrations/20260108210000_migrate_santa_cruz_content.sql`

### Test Suite
- Smoke tests: `tests/landing-migration.spec.ts`
- Run with: `npx playwright test tests/landing-migration.spec.ts`

---

**Time to Complete:** 5-10 minutes  
**Difficulty:** Easy  
**Result:** Professional, modern landing page with real content

**Let's go! 🚀**
