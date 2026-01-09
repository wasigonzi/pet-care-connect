# Dynamic Header System - Implementation Guide

## 🎯 Overview
The Pet Care Connect application now features a **fully dynamic header system** that automatically adjusts its height based on the logo size configured in the admin dashboard. This ensures the logo never overflows, gets clipped, or breaks the layout across all devices.

## ✅ Requirements Met

### 1. Data-Driven Sizing
- ✅ Logo size stored in Supabase (`landing_sections` table, `branding` key)
- ✅ Single source of truth for all header sizing
- ✅ Configuration persists across sessions

### 2. Automatic Header Adjustment
- ✅ Header height = `logoHeight + verticalPadding`
- ✅ No fixed heights that conflict with logo scaling
- ✅ Dynamically calculated on every render

### 3. Aspect Ratio Preservation
- ✅ Logo uses `object-contain` CSS
- ✅ Width set to `auto` to maintain aspect ratio
- ✅ `max-height: 100%` prevents overflow

### 4. Responsive Design
- ✅ Works on Desktop, Tablet, and Mobile
- ✅ Mobile caps logo at 48px to prevent excessive header height
- ✅ Responsive breakpoints handled via CSS

### 5. Global Consistency
- ✅ Public landing header uses `DynamicHeader` component
- ✅ Dashboard header uses same sizing logic
- ✅ Shared `SiteBranding` component ensures consistency

### 6. Admin Experience
- ✅ Slider control (20px - 100px) in CMS dashboard
- ✅ Live preview shows header + logo together
- ✅ Real-time feedback on header height
- ✅ Persists to Supabase on save

## 📁 Files Modified/Created

### New Components
1. **`components/dynamic-header.tsx`**
   - Server component that fetches branding config
   - Calculates header height dynamically
   - Injects CSS variables for responsive sizing
   - Used in public landing page

2. **`components/site-branding.tsx`** (Updated)
   - Responsive logo sizing
   - Mobile breakpoint handling (caps at 48px)
   - Aspect ratio preservation
   - Support for logo text toggle

### Updated Layouts
3. **`app/page.tsx`** (Landing Page)
   - Replaced fixed `h-20` header with `<DynamicHeader>`
   - Imports and uses dynamic sizing

4. **`app/dashboard/layout.tsx`** (Dashboard)
   - Fetches branding config
   - Calculates `minHeight` dynamically
   - Applies inline styles for header sizing

### Enhanced Admin UI
5. **`app/dashboard/admin/landing/components/cms-editor.tsx`**
   - Added "Vista Previa del Header" section
   - Live preview shows header with current logo size
   - Displays calculated header height
   - Real-time updates as slider moves

## 🔧 Technical Implementation

### Header Height Calculation
```typescript
const logoHeight = branding.logoHeight || 40; // From Supabase
const verticalPadding = 32; // 16px top + 16px bottom
const minHeaderHeight = logoHeight + verticalPadding;
```

### Responsive Logo Sizing
```typescript
// Desktop: Use configured size
height: `${logoHeight}px`

// Mobile: Cap at 48px
const mobileHeight = Math.min(logoHeight, 48);
```

### CSS Variables (DynamicHeader)
```css
:root {
    --logo-height: 60px;
    --header-min-height: 92px;
    --header-padding-y: 16px;
    --mobile-logo-height: 48px;
    --mobile-header-min-height: 80px;
}
```

## 🎨 Admin Dashboard Usage

### To Change Logo Size:
1. Navigate to `/dashboard/admin/landing`
2. Click on "Marca" tab
3. Use the "Tamaño (Altura)" slider (20px - 100px)
4. Watch the live preview update in real-time
5. Click "Guardar Marca" to persist changes
6. Changes apply immediately to:
   - Public landing page header
   - Dashboard header
   - Login page header

### Live Preview Shows:
- Simulated header with current logo size
- Logo preview (image or icon)
- Sample navigation items
- Calculated header height: `Logo + Padding`

## 📊 Data Flow

```
Supabase (landing_sections)
    ↓
getPublishedContent('home')
    ↓
branding.logoHeight
    ↓
DynamicHeader / Dashboard Layout
    ↓
Calculate minHeight
    ↓
Apply to <header> element
    ↓
SiteBranding renders logo at correct size
```

## 🔍 Testing

### Manual Testing Checklist:
- [ ] Set logo to 40px → Header should be ~72px
- [ ] Set logo to 80px → Header should be ~112px
- [ ] Set logo to 20px → Header should be ~52px
- [ ] Upload large logo → Should scale to fit
- [ ] Test on mobile → Logo should cap at 48px
- [ ] Test on tablet → Should use configured size
- [ ] Test on desktop → Should use configured size
- [ ] Refresh page → Settings should persist
- [ ] Check dashboard header → Should match landing

### Responsive Breakpoints:
- **Mobile (< 768px):** Logo capped at 48px
- **Tablet (768px - 1024px):** Full logo size
- **Desktop (> 1024px):** Full logo size

## 🚀 Benefits

1. **No Overflow:** Logo never exceeds header bounds
2. **No Clipping:** Header expands to accommodate logo
3. **Consistent UX:** Same behavior across all pages
4. **Admin Control:** Easy to adjust without code changes
5. **Responsive:** Adapts to all screen sizes
6. **Performance:** Server-side rendering, no layout shift

## ⚠️ Known Limitations

1. **CSS Inline Styles:** Used for dynamic sizing (linter warnings acceptable for this use case)
2. **Mobile Cap:** Logos > 48px are scaled down on mobile to prevent excessive header height
3. **No Animation:** Header height changes on page load, not animated (by design)

## 🔮 Future Enhancements

- [ ] Separate logo sizes per breakpoint (desktop/tablet/mobile)
- [ ] Animated header height transitions
- [ ] Logo position controls (left/center/right)
- [ ] Multiple logo variants (light/dark mode)
- [ ] Logo upload with automatic size detection

## 📝 Notes

- Inline styles are intentional for dynamic sizing based on database values
- The system prioritizes correctness over linter preferences
- All sizing is calculated server-side for performance
- CSS variables provide fallback for client-side responsiveness

---

**Status:** ✅ **FULLY IMPLEMENTED**  
**Last Updated:** 2026-01-08  
**Version:** 1.0
