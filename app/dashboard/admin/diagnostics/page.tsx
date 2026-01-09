import { requireStaff } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
    CheckCircle, 
    XCircle, 
    AlertTriangle, 
    Database, 
    Shield, 
    HardDrive, 
    Users, 
    Download,
    RefreshCw,
    Terminal
} from "lucide-react";
import Link from "next/link";
import { DiagnosticsRunner } from "./diagnostics-runner";

interface DiagnosticCheck {
    name: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
    details?: string[];
}

interface DiagnosticsResult {
    timestamp: string;
    environment: DiagnosticCheck;
    connectivity: DiagnosticCheck;
    schema: DiagnosticCheck;
    rls: DiagnosticCheck;
    storage: DiagnosticCheck;
    auth: DiagnosticCheck;
    overall: {
        status: 'healthy' | 'issues' | 'critical';
        score: number;
        totalChecks: number;
    };
}

async function runDiagnostics(): Promise<DiagnosticsResult> {
    const supabase = await createClient();
    const timestamp = new Date().toISOString();
    
    // Environment Check
    const environment: DiagnosticCheck = {
        name: 'Environment Variables',
        status: 'pass',
        message: 'All required environment variables are present',
        details: []
    };

    const requiredEnvVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        environment.status = 'fail';
        environment.message = `Missing environment variables: ${missingVars.join(', ')}`;
        environment.details = missingVars.map(v => `${v} is not set`);
    }

    // Connectivity Check
    const connectivity: DiagnosticCheck = {
        name: 'Database Connectivity',
        status: 'pass',
        message: 'Successfully connected to Supabase',
        details: []
    };

    try {
        const startTime = Date.now();
        const { error } = await supabase.from('profiles').select('count').limit(1);
        const responseTime = Date.now() - startTime;
        
        if (error && !error.message.includes('permission denied')) {
            throw error;
        }
        
        connectivity.message = `Connected successfully (${responseTime}ms)`;
        connectivity.details = [`Response time: ${responseTime}ms`];
    } catch (error: any) {
        connectivity.status = 'fail';
        connectivity.message = 'Failed to connect to database';
        connectivity.details = [error.message];
    }

    // Schema Check
    const schema: DiagnosticCheck = {
        name: 'Database Schema',
        status: 'pass',
        message: 'Core tables are present',
        details: []
    };

    try {
        const criticalTables = ['profiles', 'clients', 'patients', 'appointments', 'invoices'];
        const tableChecks = await Promise.all(
            criticalTables.map(async (table) => {
                const { data, error } = await supabase
                    .from('information_schema.tables')
                    .select('table_name')
                    .eq('table_schema', 'public')
                    .eq('table_name', table)
                    .single();
                
                return { table, exists: !!data && !error };
            })
        );

        const missingTables = tableChecks.filter(check => !check.exists).map(check => check.table);
        const existingTables = tableChecks.filter(check => check.exists).map(check => check.table);

        if (missingTables.length > 0) {
            schema.status = 'warning';
            schema.message = `Some tables are missing: ${missingTables.join(', ')}`;
            schema.details = [
                `Existing: ${existingTables.join(', ')}`,
                `Missing: ${missingTables.join(', ')}`
            ];
        } else {
            schema.message = `All critical tables present (${existingTables.length})`;
            schema.details = existingTables.map(t => `✓ ${t}`);
        }
    } catch (error: any) {
        schema.status = 'fail';
        schema.message = 'Failed to check database schema';
        schema.details = [error.message];
    }

    // RLS Check
    const rls: DiagnosticCheck = {
        name: 'Row Level Security',
        status: 'pass',
        message: 'RLS policies are configured',
        details: []
    };

    try {
        const criticalTables = ['profiles', 'clients', 'patients', 'appointments'];
        const rlsChecks = await Promise.all(
            criticalTables.map(async (table) => {
                try {
                    const { data: rlsEnabled } = await supabase
                        .from('pg_tables')
                        .select('rowsecurity')
                        .eq('tablename', table)
                        .single();

                    const { data: policies } = await supabase
                        .from('pg_policies')
                        .select('policyname')
                        .eq('tablename', table);

                    return {
                        table,
                        rlsEnabled: rlsEnabled?.rowsecurity || false,
                        policyCount: policies?.length || 0
                    };
                } catch {
                    return { table, rlsEnabled: false, policyCount: 0 };
                }
            })
        );

        const rlsIssues = rlsChecks.filter(check => !check.rlsEnabled || check.policyCount === 0);
        const rlsOk = rlsChecks.filter(check => check.rlsEnabled && check.policyCount > 0);

        if (rlsIssues.length > 0) {
            rls.status = 'warning';
            rls.message = `RLS issues found on ${rlsIssues.length} tables`;
            rls.details = [
                ...rlsOk.map(c => `✓ ${c.table}: RLS enabled, ${c.policyCount} policies`),
                ...rlsIssues.map(c => `⚠ ${c.table}: RLS ${c.rlsEnabled ? 'enabled' : 'disabled'}, ${c.policyCount} policies`)
            ];
        } else {
            rls.message = `RLS properly configured on all ${rlsOk.length} tables`;
            rls.details = rlsOk.map(c => `✓ ${c.table}: ${c.policyCount} policies`);
        }
    } catch (error: any) {
        rls.status = 'fail';
        rls.message = 'Failed to check RLS policies';
        rls.details = [error.message];
    }

    // Storage Check
    const storage: DiagnosticCheck = {
        name: 'Storage Buckets',
        status: 'pass',
        message: 'Storage buckets are accessible',
        details: []
    };

    try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) throw error;

        const expectedBuckets = ['landing-assets', 'branding-assets'];
        const existingBuckets = (buckets || []).map(b => b.name);
        const missingBuckets = expectedBuckets.filter(b => !existingBuckets.includes(b));

        if (missingBuckets.length > 0) {
            storage.status = 'warning';
            storage.message = `Some storage buckets are missing: ${missingBuckets.join(', ')}`;
            storage.details = [
                `Existing: ${existingBuckets.join(', ') || 'none'}`,
                `Missing: ${missingBuckets.join(', ')}`
            ];
        } else {
            storage.message = `All storage buckets present (${existingBuckets.length})`;
            storage.details = existingBuckets.map(b => `✓ ${b}`);
        }
    } catch (error: any) {
        storage.status = 'fail';
        storage.message = 'Failed to access storage buckets';
        storage.details = [error.message];
    }

    // Auth Check
    const auth: DiagnosticCheck = {
        name: 'Authentication System',
        status: 'pass',
        message: 'Authentication system is working',
        details: []
    };

    try {
        // Check if profiles table has proper structure
        const { data: profileColumns } = await supabase
            .from('information_schema.columns')
            .select('column_name')
            .eq('table_schema', 'public')
            .eq('table_name', 'profiles');

        const requiredColumns = ['id', 'role', 'full_name'];
        const existingColumns = (profileColumns || []).map(c => c.column_name);
        const missingColumns = requiredColumns.filter(c => !existingColumns.includes(c));

        if (missingColumns.length > 0) {
            auth.status = 'warning';
            auth.message = `Profiles table missing columns: ${missingColumns.join(', ')}`;
            auth.details = [
                `Existing columns: ${existingColumns.join(', ')}`,
                `Missing columns: ${missingColumns.join(', ')}`
            ];
        } else {
            auth.message = 'Profiles table properly configured';
            auth.details = [`✓ All required columns present: ${requiredColumns.join(', ')}`];
        }
    } catch (error: any) {
        auth.status = 'fail';
        auth.message = 'Failed to check authentication system';
        auth.details = [error.message];
    }

    // Calculate overall status
    const checks = [environment, connectivity, schema, rls, storage, auth];
    const passCount = checks.filter(c => c.status === 'pass').length;
    const failCount = checks.filter(c => c.status === 'fail').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;

    let overallStatus: 'healthy' | 'issues' | 'critical';
    if (failCount > 0) {
        overallStatus = 'critical';
    } else if (warningCount > 0) {
        overallStatus = 'issues';
    } else {
        overallStatus = 'healthy';
    }

    return {
        timestamp,
        environment,
        connectivity,
        schema,
        rls,
        storage,
        auth,
        overall: {
            status: overallStatus,
            score: Math.round((passCount / checks.length) * 100),
            totalChecks: checks.length
        }
    };
}

export default async function DiagnosticsPage() {
    // Require admin access
    const profile = await requireStaff();
    
    // Only allow admin role
    if (profile.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground">
                            This page is restricted to administrators only.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const diagnostics = await runDiagnostics();

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pass':
            case 'healthy':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'warning':
            case 'issues':
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
            case 'fail':
            case 'critical':
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return <AlertTriangle className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pass':
            case 'healthy':
                return 'bg-green-100 text-green-800';
            case 'warning':
            case 'issues':
                return 'bg-yellow-100 text-yellow-800';
            case 'fail':
            case 'critical':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Diagnostics</h1>
                    <p className="text-muted-foreground">
                        Comprehensive health check of Supabase integration
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" asChild>
                        <Link href="/reports/supabase-audit.json" target="_blank">
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                        </Link>
                    </Button>
                    <DiagnosticsRunner />
                </div>
            </div>

            {/* Overall Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        {getStatusIcon(diagnostics.overall.status)}
                        <span>Overall System Health</span>
                    </CardTitle>
                    <CardDescription>
                        Last checked: {new Date(diagnostics.timestamp).toLocaleString()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <Badge className={getStatusColor(diagnostics.overall.status)}>
                                {diagnostics.overall.status.toUpperCase()}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-2">
                                {diagnostics.overall.score}% of checks passing ({diagnostics.overall.totalChecks} total)
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold">
                                {diagnostics.overall.score}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Health Score
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Checks */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Environment */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Terminal className="h-5 w-5" />
                            <span>{diagnostics.environment.name}</span>
                            {getStatusIcon(diagnostics.environment.status)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-3">{diagnostics.environment.message}</p>
                        {diagnostics.environment.details && diagnostics.environment.details.length > 0 && (
                            <div className="space-y-1">
                                {diagnostics.environment.details.map((detail, i) => (
                                    <p key={i} className="text-xs text-muted-foreground">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Connectivity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Database className="h-5 w-5" />
                            <span>{diagnostics.connectivity.name}</span>
                            {getStatusIcon(diagnostics.connectivity.status)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-3">{diagnostics.connectivity.message}</p>
                        {diagnostics.connectivity.details && diagnostics.connectivity.details.length > 0 && (
                            <div className="space-y-1">
                                {diagnostics.connectivity.details.map((detail, i) => (
                                    <p key={i} className="text-xs text-muted-foreground">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Schema */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Database className="h-5 w-5" />
                            <span>{diagnostics.schema.name}</span>
                            {getStatusIcon(diagnostics.schema.status)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-3">{diagnostics.schema.message}</p>
                        {diagnostics.schema.details && diagnostics.schema.details.length > 0 && (
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                {diagnostics.schema.details.map((detail, i) => (
                                    <p key={i} className="text-xs text-muted-foreground">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* RLS */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span>{diagnostics.rls.name}</span>
                            {getStatusIcon(diagnostics.rls.status)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-3">{diagnostics.rls.message}</p>
                        {diagnostics.rls.details && diagnostics.rls.details.length > 0 && (
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                {diagnostics.rls.details.map((detail, i) => (
                                    <p key={i} className="text-xs text-muted-foreground">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Storage */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <HardDrive className="h-5 w-5" />
                            <span>{diagnostics.storage.name}</span>
                            {getStatusIcon(diagnostics.storage.status)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-3">{diagnostics.storage.message}</p>
                        {diagnostics.storage.details && diagnostics.storage.details.length > 0 && (
                            <div className="space-y-1">
                                {diagnostics.storage.details.map((detail, i) => (
                                    <p key={i} className="text-xs text-muted-foreground">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Auth */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <span>{diagnostics.auth.name}</span>
                            {getStatusIcon(diagnostics.auth.status)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-3">{diagnostics.auth.message}</p>
                        {diagnostics.auth.details && diagnostics.auth.details.length > 0 && (
                            <div className="space-y-1">
                                {diagnostics.auth.details.map((detail, i) => (
                                    <p key={i} className="text-xs text-muted-foreground">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>Manual Audit Instructions</CardTitle>
                    <CardDescription>
                        For a comprehensive audit, run the audit script manually
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">Run Full Audit Script:</h4>
                        <code className="bg-muted px-3 py-2 rounded text-sm block">
                            npm run audit:supabase
                        </code>
                    </div>
                    
                    <Separator />
                    
                    <div>
                        <h4 className="font-medium mb-2">Alternative (direct execution):</h4>
                        <code className="bg-muted px-3 py-2 rounded text-sm block">
                            npx tsx scripts/supabase-audit.ts
                        </code>
                    </div>

                    <Separator />

                    <div>
                        <h4 className="font-medium mb-2">Output:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Detailed JSON report: <code>reports/supabase-audit.json</code></li>
                            <li>• Console summary with actionable recommendations</li>
                            <li>• SQL migration files (if fixes needed)</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}