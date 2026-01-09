# 🔍 Supabase Audit System

A comprehensive audit system for Next.js + Supabase applications that verifies database schema, RLS policies, storage configuration, and code-database alignment.

## 📋 Overview

This audit system provides:
- **Automated schema validation** - Ensures all required tables and columns exist
- **RLS policy verification** - Checks Row Level Security configuration
- **Storage bucket auditing** - Validates storage setup and permissions
- **Code-database alignment** - Compares code expectations with actual DB schema
- **Admin diagnostics dashboard** - Real-time health monitoring
- **Actionable SQL fixes** - Generates migration scripts for issues

## 🚀 Quick Start

### 1. Run the Audit Script

```bash
# Run comprehensive audit
npm run audit:supabase

# Alternative direct execution
npx tsx scripts/supabase-audit.ts
```

### 2. View Results

- **Console Output**: Immediate summary with pass/fail status
- **JSON Report**: Detailed results in `reports/supabase-audit.json`
- **Admin Dashboard**: Visit `/dashboard/admin/diagnostics` (admin only)

### 3. Apply Fixes

```bash
# Apply generated SQL fixes in Supabase Dashboard
# Files: supabase/migrations/20260108240000_audit_fixes_*.sql
```

## 📁 File Structure

```
├── scripts/
│   └── supabase-audit.ts          # Main audit script
├── app/dashboard/admin/diagnostics/
│   ├── page.tsx                   # Admin diagnostics page
│   └── diagnostics-runner.tsx     # Client-side audit trigger
├── supabase/migrations/
│   ├── 20260108240000_audit_fixes_schema.sql  # Schema fixes
│   ├── 20260108240001_audit_fixes_rls.sql     # RLS policy fixes
│   ├── 20260108240002_audit_fixes_storage.sql # Storage fixes
│   └── 20260108240003_audit_helper_functions.sql # Helper functions
└── reports/
    └── supabase-audit.json        # Generated audit report
```

## 🔧 Audit Components

### 1. Environment Check
Validates required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (required for deep introspection)

### 2. Connectivity Test
- Tests connection to Supabase
- Measures response time
- Validates basic query functionality

### 3. Schema Inventory
- Catalogs all tables and columns
- Checks constraints and indexes
- Identifies missing database objects
- Compares with code expectations

### 4. RLS Policy Audit
- Verifies RLS is enabled on critical tables
- Lists all policies with their rules
- Identifies missing or weak policies
- Checks for infinite recursion issues

### 5. Storage Verification
- Lists all storage buckets
- Tests upload/download permissions
- Validates bucket policies
- Checks for missing buckets

### 6. Auth Integrity Check
- Verifies profiles table structure
- Checks user role enum existence
- Validates auth triggers
- Tests user-profile alignment

### 7. Code-Database Alignment
- Scans code for Supabase queries
- Extracts expected tables/columns
- Compares with actual schema
- Reports mismatches

## 📊 Admin Diagnostics Dashboard

Access: `/dashboard/admin/diagnostics` (admin role required)

### Features:
- **Real-time health checks** - Live system status
- **Visual status indicators** - Pass/fail/warning badges
- **Detailed error messages** - Actionable information
- **Download reports** - JSON export functionality
- **Manual audit trigger** - Run audits on-demand

### Health Checks:
- ✅ Environment variables
- ✅ Database connectivity
- ✅ Schema completeness
- ✅ RLS policy status
- ✅ Storage accessibility
- ✅ Auth system integrity

## 🛠️ SQL Fix Generators

The audit system generates SQL migration files to fix identified issues:

### Schema Fixes (`audit_fixes_schema.sql`)
- Creates missing tables
- Adds missing columns
- Creates required indexes
- Adds foreign key constraints

### RLS Fixes (`audit_fixes_rls.sql`)
- Enables RLS on tables
- Creates safe, non-recursive policies
- Implements role-based access control
- Fixes infinite recursion issues

### Storage Fixes (`audit_fixes_storage.sql`)
- Creates missing storage buckets
- Sets up bucket policies
- Configures file type validation
- Implements cleanup functions

## 🔐 Security Features

### Non-Recursive RLS Policies
The audit system generates RLS policies that avoid infinite recursion by:
- Using JWT-based role checks instead of database queries
- Implementing helper functions that don't query the same table
- Creating separate policies for different operations

### Role-Based Access Control
- **Admin**: Full system access
- **Staff**: Operational data access
- **Client**: Own data only
- **Public**: Published content only

## 📈 Monitoring & Maintenance

### Regular Audits
Run audits regularly to catch issues early:
```bash
# Weekly audit
npm run audit:supabase

# CI/CD integration
npx tsx scripts/supabase-audit.ts || exit 1
```

### Health Monitoring
Monitor the admin dashboard for:
- Database connectivity issues
- RLS policy problems
- Storage access failures
- Schema drift

### Performance Tracking
The audit tracks:
- Query response times
- Schema complexity
- Policy effectiveness
- Storage usage

## 🚨 Common Issues & Solutions

### Issue: Infinite Recursion in RLS
**Symptom**: `infinite recursion detected in policy for relation "profiles"`
**Solution**: Apply RLS fixes that use JWT-based role detection

### Issue: Missing Tables
**Symptom**: Code references tables that don't exist
**Solution**: Apply schema fixes to create missing tables

### Issue: Storage Access Denied
**Symptom**: Cannot upload/download files
**Solution**: Apply storage fixes to create buckets and policies

### Issue: Auth Session Missing
**Symptom**: Users can't access protected routes
**Solution**: Check auth integrity and profile table structure

## 🔄 Integration with CI/CD

### GitHub Actions Example
```yaml
name: Supabase Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run audit:supabase
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
```

## 📝 Customization

### Adding Custom Checks
Extend the audit system by modifying `scripts/supabase-audit.ts`:

```typescript
// Add custom check
private async checkCustomFeature(): Promise<CustomCheck> {
    // Your custom validation logic
    return {
        status: 'pass',
        message: 'Custom feature is working',
        details: []
    };
}
```

### Custom SQL Fixes
Add custom migration templates in `supabase/migrations/`:
- Follow the naming convention: `YYYYMMDDHHMMSS_audit_fixes_*.sql`
- Include rollback instructions in comments
- Test thoroughly before applying

## 🎯 Best Practices

### Development Workflow
1. **Run audit before major changes**
2. **Fix critical issues immediately**
3. **Review warnings regularly**
4. **Update migrations incrementally**

### Production Deployment
1. **Run audit in staging first**
2. **Apply fixes during maintenance windows**
3. **Monitor health dashboard post-deployment**
4. **Keep audit reports for compliance**

### Security Considerations
1. **Never expose service role key in client code**
2. **Regularly rotate API keys**
3. **Monitor RLS policy effectiveness**
4. **Audit storage permissions regularly**

## 📞 Support & Troubleshooting

### Debug Mode
Enable verbose logging:
```bash
DEBUG=supabase-audit npm run audit:supabase
```

### Common Commands
```bash
# Check specific component
npx tsx scripts/supabase-audit.ts --component=rls

# Generate only SQL fixes
npx tsx scripts/supabase-audit.ts --fixes-only

# Skip non-critical checks
npx tsx scripts/supabase-audit.ts --critical-only
```

### Getting Help
1. Check the generated JSON report for detailed error messages
2. Review the admin diagnostics dashboard
3. Examine Supabase logs for additional context
4. Consult the migration files for fix examples

---

## 🎉 Success Metrics

A healthy Supabase setup should show:
- ✅ **100% environment check** - All variables present
- ✅ **Sub-second connectivity** - Fast database responses
- ✅ **Complete schema** - All expected tables/columns exist
- ✅ **Secure RLS** - Proper policies without recursion
- ✅ **Accessible storage** - All buckets working
- ✅ **Auth integrity** - Users have proper profiles

**Target Score: 95%+ overall health**

---

*Generated by Supabase Audit System v1.0*  
*Last Updated: January 8, 2026*