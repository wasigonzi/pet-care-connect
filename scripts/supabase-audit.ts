#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

// Types for audit results
interface AuditResult {
  timestamp: string;
  environment: EnvironmentCheck;
  connectivity: ConnectivityCheck;
  schema: SchemaInventory;
  rls: RLSInventory;
  storage: StorageInventory;
  auth: AuthIntegrityCheck;
  codeAlignment: CodeAlignmentCheck;
  summary: AuditSummary;
  recommendations: string[];
  sqlFixes: string[];
}

interface EnvironmentCheck {
  status: 'pass' | 'fail';
  variables: {
    NEXT_PUBLIC_SUPABASE_URL: boolean;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: boolean;
    SUPABASE_SERVICE_ROLE_KEY: boolean;
  };
  errors: string[];
}

interface ConnectivityCheck {
  status: 'pass' | 'fail';
  responseTime: number;
  error?: string;
}

interface SchemaInventory {
  status: 'pass' | 'fail';
  tables: TableInfo[];
  missingTables: string[];
  missingColumns: { table: string; column: string }[];
  missingIndexes: { table: string; columns: string[] }[];
  errors: string[];
}

interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  constraints: ConstraintInfo[];
  indexes: IndexInfo[];
  rlsEnabled: boolean;
}

interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
}

interface ConstraintInfo {
  name: string;
  type: string;
  definition: string;
}

interface IndexInfo {
  name: string;
  columns: string[];
  unique: boolean;
}

interface RLSInventory {
  status: 'pass' | 'fail';
  tables: RLSTableInfo[];
  missingPolicies: string[];
  weakPolicies: string[];
  errors: string[];
}

interface RLSTableInfo {
  name: string;
  rlsEnabled: boolean;
  policies: PolicyInfo[];
}

interface PolicyInfo {
  name: string;
  command: string;
  roles: string[];
  using?: string;
  withCheck?: string;
}

interface StorageInventory {
  status: 'pass' | 'fail';
  buckets: BucketInfo[];
  missingBuckets: string[];
  testResults: { [bucket: string]: boolean };
  errors: string[];
}

interface BucketInfo {
  name: string;
  public: boolean;
  policies: string[];
}

interface AuthIntegrityCheck {
  status: 'pass' | 'fail';
  profileTableExists: boolean;
  userRoleEnumExists: boolean;
  triggerExists: boolean;
  sampleUserHasProfile: boolean;
  errors: string[];
}

interface CodeAlignmentCheck {
  status: 'pass' | 'fail';
  expectedTables: string[];
  expectedColumns: { [table: string]: string[] };
  missingInDB: { tables: string[]; columns: { table: string; column: string }[] };
  unusedInDB: { tables: string[]; columns: { table: string; column: string }[] };
  errors: string[];
}

interface AuditSummary {
  overallStatus: 'pass' | 'fail';
  passedChecks: number;
  totalChecks: number;
  criticalIssues: number;
  warningIssues: number;
}

class SupabaseAuditor {
  private supabaseUrl: string;
  private anonKey: string;
  private serviceKey: string;
  private adminClient: any;
  private anonClient: any;

  constructor() {
    // Load environment variables
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    this.serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  }

  async runAudit(): Promise<AuditResult> {
    console.log('🔍 Starting Supabase Audit...\n');

    const result: AuditResult = {
      timestamp: new Date().toISOString(),
      environment: await this.checkEnvironment(),
      connectivity: await this.checkConnectivity(),
      schema: await this.inventorySchema(),
      rls: await this.inventoryRLS(),
      storage: await this.inventoryStorage(),
      auth: await this.checkAuthIntegrity(),
      codeAlignment: await this.checkCodeAlignment(),
      summary: { overallStatus: 'pass', passedChecks: 0, totalChecks: 0, criticalIssues: 0, warningIssues: 0 },
      recommendations: [],
      sqlFixes: []
    };

    // Calculate summary
    result.summary = this.calculateSummary(result);
    result.recommendations = this.generateRecommendations(result);
    result.sqlFixes = this.generateSQLFixes(result);

    return result;
  }

  private async checkEnvironment(): Promise<EnvironmentCheck> {
    console.log('1️⃣ Checking environment variables...');

    const check: EnvironmentCheck = {
      status: 'pass',
      variables: {
        NEXT_PUBLIC_SUPABASE_URL: !!this.supabaseUrl,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!this.anonKey,
        SUPABASE_SERVICE_ROLE_KEY: !!this.serviceKey
      },
      errors: []
    };

    if (!this.supabaseUrl) {
      check.errors.push('NEXT_PUBLIC_SUPABASE_URL is missing');
      check.status = 'fail';
    }

    if (!this.anonKey) {
      check.errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
      check.status = 'fail';
    }

    if (!this.serviceKey) {
      check.errors.push('SUPABASE_SERVICE_ROLE_KEY is missing (required for deep schema introspection)');
      check.status = 'fail';
    }

    if (check.status === 'fail') {
      console.log('❌ Environment check failed');
      check.errors.forEach(error => console.log(`   - ${error}`));
      return check;
    }

    // Initialize clients
    this.adminClient = createClient(this.supabaseUrl, this.serviceKey);
    this.anonClient = createClient(this.supabaseUrl, this.anonKey);

    console.log('✅ Environment variables OK');
    return check;
  }

  private async checkConnectivity(): Promise<ConnectivityCheck> {
    console.log('2️⃣ Checking connectivity...');

    const startTime = Date.now();
    
    try {
      const { data, error } = await this.anonClient.from('profiles').select('count').limit(1);
      const responseTime = Date.now() - startTime;

      if (error && !error.message.includes('permission denied')) {
        throw error;
      }

      console.log(`✅ Connectivity OK (${responseTime}ms)`);
      return {
        status: 'pass',
        responseTime
      };
    } catch (error: any) {
      console.log('❌ Connectivity failed');
      return {
        status: 'fail',
        responseTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  private async inventorySchema(): Promise<SchemaInventory> {
    console.log('3️⃣ Inventorying database schema...');

    const inventory: SchemaInventory = {
      status: 'pass',
      tables: [],
      missingTables: [],
      missingColumns: [],
      missingIndexes: [],
      errors: []
    };

    try {
      // Get all tables
      const { data: tables, error: tablesError } = await this.adminClient
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .neq('table_name', 'schema_migrations');

      if (tablesError) throw tablesError;

      for (const table of tables || []) {
        const tableInfo = await this.getTableInfo(table.table_name);
        inventory.tables.push(tableInfo);
      }

      // Check for expected tables based on code usage
      const expectedTables = this.getExpectedTables();
      const actualTables = inventory.tables.map(t => t.name);
      
      inventory.missingTables = expectedTables.filter(t => !actualTables.includes(t));

      if (inventory.missingTables.length > 0) {
        inventory.status = 'fail';
        console.log(`❌ Missing tables: ${inventory.missingTables.join(', ')}`);
      } else {
        console.log(`✅ Schema inventory complete (${inventory.tables.length} tables)`);
      }

    } catch (error: any) {
      inventory.status = 'fail';
      inventory.errors.push(error.message);
      console.log('❌ Schema inventory failed:', error.message);
    }

    return inventory;
  }

  private async getTableInfo(tableName: string): Promise<TableInfo> {
    // Get columns
    const { data: columns } = await this.adminClient
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);

    // Get constraints
    const { data: constraints } = await this.adminClient.rpc('get_table_constraints', {
      table_name: tableName
    }).catch(() => ({ data: [] }));

    // Get indexes
    const { data: indexes } = await this.adminClient.rpc('get_table_indexes', {
      table_name: tableName
    }).catch(() => ({ data: [] }));

    // Check RLS status
    const { data: rlsStatus } = await this.adminClient
      .from('pg_tables')
      .select('rowsecurity')
      .eq('tablename', tableName)
      .single();

    return {
      name: tableName,
      columns: (columns || []).map(col => ({
        name: col.column_name,
        type: col.data_type,
        nullable: col.is_nullable === 'YES',
        default: col.column_default
      })),
      constraints: constraints || [],
      indexes: indexes || [],
      rlsEnabled: rlsStatus?.rowsecurity || false
    };
  }

  private async inventoryRLS(): Promise<RLSInventory> {
    console.log('4️⃣ Checking RLS policies...');

    const inventory: RLSInventory = {
      status: 'pass',
      tables: [],
      missingPolicies: [],
      weakPolicies: [],
      errors: []
    };

    try {
      const criticalTables = ['profiles', 'clients', 'patients', 'appointments', 'invoices'];

      for (const tableName of criticalTables) {
        const { data: policies, error } = await this.adminClient
          .from('pg_policies')
          .select('*')
          .eq('tablename', tableName);

        if (error) {
          inventory.errors.push(`Failed to get policies for ${tableName}: ${error.message}`);
          continue;
        }

        const { data: rlsEnabled } = await this.adminClient
          .from('pg_tables')
          .select('rowsecurity')
          .eq('tablename', tableName)
          .single();

        const tableInfo: RLSTableInfo = {
          name: tableName,
          rlsEnabled: rlsEnabled?.rowsecurity || false,
          policies: (policies || []).map(p => ({
            name: p.policyname,
            command: p.cmd,
            roles: p.roles ? p.roles.split(',') : [],
            using: p.qual,
            withCheck: p.with_check
          }))
        };

        inventory.tables.push(tableInfo);

        // Check for missing or weak policies
        if (!tableInfo.rlsEnabled) {
          inventory.missingPolicies.push(`${tableName}: RLS not enabled`);
        }

        if (tableInfo.policies.length === 0) {
          inventory.missingPolicies.push(`${tableName}: No policies defined`);
        }
      }

      if (inventory.missingPolicies.length > 0) {
        inventory.status = 'fail';
        console.log('❌ RLS issues found');
      } else {
        console.log('✅ RLS policies OK');
      }

    } catch (error: any) {
      inventory.status = 'fail';
      inventory.errors.push(error.message);
      console.log('❌ RLS check failed:', error.message);
    }

    return inventory;
  }

  private async inventoryStorage(): Promise<StorageInventory> {
    console.log('5️⃣ Checking storage buckets...');

    const inventory: StorageInventory = {
      status: 'pass',
      buckets: [],
      missingBuckets: [],
      testResults: {},
      errors: []
    };

    try {
      const { data: buckets, error } = await this.adminClient.storage.listBuckets();

      if (error) throw error;

      inventory.buckets = (buckets || []).map(bucket => ({
        name: bucket.name,
        public: bucket.public,
        policies: [] // Would need additional query to get policies
      }));

      // Check for expected buckets
      const expectedBuckets = ['landing-assets', 'branding-assets', 'attachments'];
      const actualBuckets = inventory.buckets.map(b => b.name);
      
      inventory.missingBuckets = expectedBuckets.filter(b => !actualBuckets.includes(b));

      // Test upload/download for existing buckets
      for (const bucket of inventory.buckets) {
        try {
          const testFile = new Uint8Array([1, 2, 3, 4]);
          const testPath = `test-${Date.now()}.bin`;

          const { error: uploadError } = await this.adminClient.storage
            .from(bucket.name)
            .upload(testPath, testFile);

          if (!uploadError) {
            await this.adminClient.storage
              .from(bucket.name)
              .remove([testPath]);
            
            inventory.testResults[bucket.name] = true;
          } else {
            inventory.testResults[bucket.name] = false;
          }
        } catch {
          inventory.testResults[bucket.name] = false;
        }
      }

      if (inventory.missingBuckets.length > 0) {
        inventory.status = 'fail';
        console.log(`❌ Missing buckets: ${inventory.missingBuckets.join(', ')}`);
      } else {
        console.log('✅ Storage buckets OK');
      }

    } catch (error: any) {
      inventory.status = 'fail';
      inventory.errors.push(error.message);
      console.log('❌ Storage check failed:', error.message);
    }

    return inventory;
  }

  private async checkAuthIntegrity(): Promise<AuthIntegrityCheck> {
    console.log('6️⃣ Checking auth integrity...');

    const check: AuthIntegrityCheck = {
      status: 'pass',
      profileTableExists: false,
      userRoleEnumExists: false,
      triggerExists: false,
      sampleUserHasProfile: false,
      errors: []
    };

    try {
      // Check if profiles table exists
      const { data: profileTable } = await this.adminClient
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'profiles')
        .single();

      check.profileTableExists = !!profileTable;

      // Check if user_role enum exists
      const { data: userRoleEnum } = await this.adminClient
        .from('information_schema.types')
        .select('typname')
        .eq('typname', 'user_role')
        .single();

      check.userRoleEnumExists = !!userRoleEnum;

      // Check if trigger exists
      const { data: trigger } = await this.adminClient
        .from('information_schema.triggers')
        .select('trigger_name')
        .eq('trigger_name', 'on_auth_user_created')
        .single();

      check.triggerExists = !!trigger;

      // Check if sample user has profile
      const { data: users } = await this.adminClient.auth.admin.listUsers();
      if (users && users.users.length > 0) {
        const sampleUser = users.users[0];
        const { data: profile } = await this.adminClient
          .from('profiles')
          .select('id')
          .eq('id', sampleUser.id)
          .single();

        check.sampleUserHasProfile = !!profile;
      }

      const issues = [];
      if (!check.profileTableExists) issues.push('profiles table missing');
      if (!check.userRoleEnumExists) issues.push('user_role enum missing');
      if (!check.triggerExists) issues.push('auth trigger missing');
      if (!check.sampleUserHasProfile) issues.push('users missing profiles');

      if (issues.length > 0) {
        check.status = 'fail';
        check.errors = issues;
        console.log('❌ Auth integrity issues:', issues.join(', '));
      } else {
        console.log('✅ Auth integrity OK');
      }

    } catch (error: any) {
      check.status = 'fail';
      check.errors.push(error.message);
      console.log('❌ Auth integrity check failed:', error.message);
    }

    return check;
  }

  private async checkCodeAlignment(): Promise<CodeAlignmentCheck> {
    console.log('7️⃣ Checking code-database alignment...');

    const check: CodeAlignmentCheck = {
      status: 'pass',
      expectedTables: [],
      expectedColumns: {},
      missingInDB: { tables: [], columns: [] },
      unusedInDB: { tables: [], columns: [] },
      errors: []
    };

    try {
      // Scan code for Supabase usage
      const codeUsage = await this.scanCodeForSupabaseUsage();
      check.expectedTables = codeUsage.tables;
      check.expectedColumns = codeUsage.columns;

      // Get actual DB schema
      const { data: actualTables } = await this.adminClient
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      const actualTableNames = (actualTables || []).map(t => t.table_name);

      // Find missing tables
      check.missingInDB.tables = check.expectedTables.filter(t => !actualTableNames.includes(t));

      // Find missing columns
      for (const [table, expectedCols] of Object.entries(check.expectedColumns)) {
        if (actualTableNames.includes(table)) {
          const { data: actualCols } = await this.adminClient
            .from('information_schema.columns')
            .select('column_name')
            .eq('table_schema', 'public')
            .eq('table_name', table);

          const actualColNames = (actualCols || []).map(c => c.column_name);
          const missingCols = expectedCols.filter(c => !actualColNames.includes(c));
          
          missingCols.forEach(col => {
            check.missingInDB.columns.push({ table, column: col });
          });
        }
      }

      if (check.missingInDB.tables.length > 0 || check.missingInDB.columns.length > 0) {
        check.status = 'fail';
        console.log('❌ Code-DB alignment issues found');
      } else {
        console.log('✅ Code-DB alignment OK');
      }

    } catch (error: any) {
      check.status = 'fail';
      check.errors.push(error.message);
      console.log('❌ Code alignment check failed:', error.message);
    }

    return check;
  }

  private async scanCodeForSupabaseUsage(): Promise<{ tables: string[]; columns: { [table: string]: string[] } }> {
    const tables = new Set<string>();
    const columns: { [table: string]: Set<string> } = {};

    try {
      // Find all TypeScript/JavaScript files
      const files = await glob('**/*.{ts,tsx,js,jsx}', {
        ignore: ['node_modules/**', '.next/**', 'dist/**'],
        cwd: process.cwd()
      });

      for (const file of files) {
        const content = readFileSync(file, 'utf-8');
        
        // Look for .from('table') patterns
        const fromMatches = content.match(/\.from\(['"`]([^'"`]+)['"`]\)/g);
        if (fromMatches) {
          fromMatches.forEach(match => {
            const table = match.match(/\.from\(['"`]([^'"`]+)['"`]\)/)?.[1];
            if (table) tables.add(table);
          });
        }

        // Look for .select('columns') patterns
        const selectMatches = content.match(/\.select\(['"`]([^'"`]+)['"`]\)/g);
        if (selectMatches) {
          selectMatches.forEach(match => {
            const selectClause = match.match(/\.select\(['"`]([^'"`]+)['"`]\)/)?.[1];
            if (selectClause) {
              // Parse column names from select clause
              const cols = selectClause.split(',').map(c => c.trim().split('.')[0]);
              // This is simplified - would need more sophisticated parsing for complex selects
            }
          });
        }
      }
    } catch (error) {
      console.warn('Could not scan code files:', error);
    }

    return {
      tables: Array.from(tables),
      columns: Object.fromEntries(
        Object.entries(columns).map(([table, colSet]) => [table, Array.from(colSet)])
      )
    };
  }

  private getExpectedTables(): string[] {
    // Based on the app structure, these are the expected tables
    return [
      'profiles',
      'clients', 
      'patients',
      'appointments',
      'medical_records',
      'vaccinations',
      'invoices',
      'invoice_items',
      'inventory_items',
      'communications',
      'tasks',
      'reminders',
      'templates',
      'wellness_plans',
      'boarding_reservations',
      'suppliers',
      'estimates',
      'audit_logs',
      'time_tracking',
      'landing_content',
      'landing_sections'
    ];
  }

  private calculateSummary(result: AuditResult): AuditSummary {
    const checks = [
      result.environment,
      result.connectivity,
      result.schema,
      result.rls,
      result.storage,
      result.auth,
      result.codeAlignment
    ];

    const passedChecks = checks.filter(c => c.status === 'pass').length;
    const totalChecks = checks.length;

    let criticalIssues = 0;
    let warningIssues = 0;

    if (result.environment.status === 'fail') criticalIssues++;
    if (result.connectivity.status === 'fail') criticalIssues++;
    if (result.auth.status === 'fail') criticalIssues++;
    if (result.rls.status === 'fail') warningIssues++;
    if (result.schema.status === 'fail') warningIssues++;
    if (result.storage.status === 'fail') warningIssues++;
    if (result.codeAlignment.status === 'fail') warningIssues++;

    return {
      overallStatus: criticalIssues > 0 ? 'fail' : 'pass',
      passedChecks,
      totalChecks,
      criticalIssues,
      warningIssues
    };
  }

  private generateRecommendations(result: AuditResult): string[] {
    const recommendations: string[] = [];

    if (result.environment.status === 'fail') {
      recommendations.push('Fix missing environment variables before proceeding');
    }

    if (result.rls.missingPolicies.length > 0) {
      recommendations.push('Enable RLS and create policies for data security');
    }

    if (result.schema.missingTables.length > 0) {
      recommendations.push('Create missing database tables');
    }

    if (result.storage.missingBuckets.length > 0) {
      recommendations.push('Create missing storage buckets');
    }

    if (!result.auth.profileTableExists) {
      recommendations.push('Create profiles table for user management');
    }

    return recommendations;
  }

  private generateSQLFixes(result: AuditResult): string[] {
    const fixes: string[] = [];

    // RLS fixes
    if (result.rls.status === 'fail') {
      fixes.push(`
-- Enable RLS on critical tables
${result.rls.tables
  .filter(t => !t.rlsEnabled)
  .map(t => `ALTER TABLE ${t.name} ENABLE ROW LEVEL SECURITY;`)
  .join('\n')}

-- Create basic policies
${result.rls.tables
  .filter(t => t.policies.length === 0)
  .map(t => `
CREATE POLICY "Users can view own ${t.name}" ON ${t.name}
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = id);

CREATE POLICY "Users can update own ${t.name}" ON ${t.name}
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = id);`)
  .join('\n')}
      `);
    }

    // Schema fixes
    if (result.schema.missingTables.length > 0) {
      fixes.push(`
-- Create missing tables
${result.schema.missingTables.map(table => `
-- TODO: Define ${table} table structure
CREATE TABLE ${table} (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`).join('\n')}
      `);
    }

    return fixes;
  }

  async saveReport(result: AuditResult): Promise<void> {
    // Ensure reports directory exists
    const reportsDir = join(process.cwd(), 'reports');
    if (!existsSync(reportsDir)) {
      mkdirSync(reportsDir, { recursive: true });
    }

    // Save JSON report
    const reportPath = join(reportsDir, 'supabase-audit.json');
    writeFileSync(reportPath, JSON.stringify(result, null, 2));

    console.log(`\n📄 Report saved to: ${reportPath}`);
  }

  printSummary(result: AuditResult): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUPABASE AUDIT SUMMARY');
    console.log('='.repeat(60));

    const { summary } = result;
    
    console.log(`Overall Status: ${summary.overallStatus === 'pass' ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Checks Passed: ${summary.passedChecks}/${summary.totalChecks}`);
    console.log(`Critical Issues: ${summary.criticalIssues}`);
    console.log(`Warning Issues: ${summary.warningIssues}`);

    console.log('\n📋 DETAILED RESULTS:');
    console.log(`Environment:     ${result.environment.status === 'pass' ? '✅' : '❌'}`);
    console.log(`Connectivity:    ${result.connectivity.status === 'pass' ? '✅' : '❌'}`);
    console.log(`Schema:          ${result.schema.status === 'pass' ? '✅' : '❌'}`);
    console.log(`RLS Policies:    ${result.rls.status === 'pass' ? '✅' : '❌'}`);
    console.log(`Storage:         ${result.storage.status === 'pass' ? '✅' : '❌'}`);
    console.log(`Auth Integrity:  ${result.auth.status === 'pass' ? '✅' : '❌'}`);
    console.log(`Code Alignment:  ${result.codeAlignment.status === 'pass' ? '✅' : '❌'}`);

    if (result.recommendations.length > 0) {
      console.log('\n🔧 RECOMMENDATIONS:');
      result.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
    }

    console.log('\n' + '='.repeat(60));
  }
}

// Main execution
async function main() {
  try {
    // Load environment variables from .env.local
    const envPath = join(process.cwd(), '.env.local');
    if (existsSync(envPath)) {
      const envContent = readFileSync(envPath, 'utf-8');
      envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      });
    }

    const auditor = new SupabaseAuditor();
    const result = await auditor.runAudit();
    
    await auditor.saveReport(result);
    auditor.printSummary(result);

    // Exit with error code if audit failed
    if (result.summary.overallStatus === 'fail') {
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { SupabaseAuditor, type AuditResult };