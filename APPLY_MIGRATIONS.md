# Apply Production RBAC Migrations

## CRITICAL: These migrations must be applied to complete Task 3

The production RBAC system and reminders performance fixes are ready but need to be applied to the Supabase database.

## Option 1: Manual Application (RECOMMENDED)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Navigate to your project: `zevlllpqcbaeqnzzoajc`
   - Go to SQL Editor

2. **Apply Migration 1: Production RBAC System**
   - Copy the entire contents of: `supabase/migrations/20260109000000_production_rbac_system.sql`
   - Paste into SQL Editor
   - Click "Run" to execute
   - ✅ This eliminates infinite recursion and implements JWT-based role detection

3. **Apply Migration 2: Reminders Performance Fix**
   - Copy the entire contents of: `supabase/migrations/20260109000001_fix_reminders_performance.sql`
   - Paste into SQL Editor
   - Click "Run" to execute
   - ✅ This fixes the reminders timeout issue with proper indexing

## Option 2: Using Supabase CLI (if configured)

```bash
# Link project (if not already linked)
npx supabase link --project-ref zevlllpqcbaeqnzzoajc

# Apply migrations
npx supabase db push
```

## What These Migrations Do

### Production RBAC System (`20260109000000_production_rbac_system.sql`)
- ✅ **Eliminates infinite recursion** in RLS policies
- ✅ **JWT-based role detection** (no database queries in policies)
- ✅ **Proper RBAC enforcement** for all tables
- ✅ **Client data isolation** (clients only see their own data)
- ✅ **Staff operational access** (vets, assistants, receptionists)
- ✅ **Admin full access** to all data
- ✅ **Performance indexes** for RLS queries
- ✅ **Auth trigger** for automatic profile creation

### Reminders Performance Fix (`20260109000001_fix_reminders_performance.sql`)
- ✅ **Optimized indexes** for fast queries
- ✅ **Pagination function** for large datasets
- ✅ **Materialized view** for complex joins
- ✅ **RLS policies** for staff-only access
- ✅ **Sample data** for testing (optional)

## After Applying Migrations

1. **Test Login Flow**
   ```bash
   npm run dev
   ```
   - Visit http://localhost:3000/login
   - Test with different user roles:
     - Admin: should go to `/dashboard`
     - Staff: should go to `/dashboard`
     - Client: should go to `/client`

2. **Verify No Infinite Recursion**
   - Check browser console for errors
   - Check Supabase logs for recursion errors
   - Login should be fast and stable

3. **Test Reminders Performance**
   - Visit `/dashboard/reminders`
   - Should load quickly (< 2 seconds)
   - Pagination should work smoothly

4. **Run Tests**
   ```bash
   npm run test
   ```

## Troubleshooting

If you encounter issues:

1. **Check Supabase Logs**
   - Go to Supabase Dashboard > Logs
   - Look for SQL errors or policy violations

2. **Verify Environment Variables**
   - Ensure `.env.local` has correct Supabase URL and keys

3. **Test Database Connection**
   - Visit `/dashboard/admin/diagnostics`
   - Check connectivity and schema status

## Success Indicators

After applying migrations, you should see:
- ✅ Login works for all user roles
- ✅ No redirect loops
- ✅ No infinite recursion errors in logs
- ✅ Reminders page loads quickly
- ✅ All tests pass
- ✅ Proper role-based access control

## Direct SQL Editor Link

https://supabase.com/dashboard/project/zevlllpqcbaeqnzzoajc/sql