import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Map to existing user_role enum: 'admin', 'vet', 'assistant', 'receptionist', 'client'
export type UserRole = 'admin' | 'vet' | 'assistant' | 'receptionist' | 'client';

// Helper type for staff roles
export type StaffRole = 'admin' | 'vet' | 'assistant' | 'receptionist';

export interface UserProfile {
    id: string;
    role: UserRole;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Check if a role is a staff role (admin, vet, assistant, receptionist)
 */
export function isStaffRole(role: UserRole): role is StaffRole {
    return ['admin', 'vet', 'assistant', 'receptionist'].includes(role);
}

/**
 * Get current user and their profile
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return user;
}

/**
 * Get user profile with role information
 */
export async function getUserProfile(userId?: string): Promise<UserProfile | null> {
    const supabase = await createClient();

    // If no userId provided, get current user
    if (!userId) {
        const user = await getCurrentUser();
        if (!user) return null;
        userId = user.id;
    }

    try {
        // Try to get the full profile directly first
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (!error && data) {
            return data as UserProfile;
        }

        // If direct access fails, try the safe function
        const { data: roleResult, error: roleError } = await supabase
            .rpc('get_user_role_safe', { user_id: userId });

        if (roleError) {
            console.error('Error fetching role with safe function:', roleError);
            // Return a minimal profile with client role as fallback
            return {
                id: userId,
                role: 'client',
                full_name: null,
                phone: null,
                avatar_url: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            } as UserProfile;
        }

        // Return a minimal profile with the detected role
        return {
            id: userId,
            role: roleResult || 'client',
            full_name: null,
            phone: null,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        } as UserProfile;
    } catch (error) {
        console.error('Profile fetch failed:', error);
        // Ultimate fallback
        return {
            id: userId,
            role: 'client',
            full_name: null,
            phone: null,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        } as UserProfile;
    }
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: UserRole | UserRole[]): Promise<boolean> {
    try {
        const supabase = await createClient();
        const user = await getCurrentUser();
        if (!user) return false;

        // Try the safe role detection function first
        const { data: roleResult, error: roleError } = await supabase
            .rpc('get_user_role_safe', { user_id: user.id });

        let userRole = 'client'; // default fallback

        if (roleError) {
            console.error('Role check with safe function failed:', roleError);
            // Fallback: try to get role directly from profiles table
            try {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (!profileError && profile) {
                    userRole = profile.role;
                }
            } catch (fallbackError) {
                console.error('Fallback role check failed:', fallbackError);
                userRole = 'client'; // ultimate fallback
            }
        } else {
            userRole = roleResult || 'client';
        }

        const roles = Array.isArray(role) ? role : [role];
        return roles.includes(userRole as UserRole);
    } catch (error) {
        console.error('Role check failed:', error);
        return false;
    }
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }
    return user;
}

/**
 * Require specific role - redirect if user doesn't have the role
 */
export async function requireRole(role: UserRole | UserRole[], redirectTo: string = '/') {
    await requireAuth();
    
    try {
        const hasRequiredRole = await hasRole(role);
        if (!hasRequiredRole) {
            redirect(redirectTo);
        }
    } catch (error) {
        console.error('Role requirement check failed:', error);
        redirect(redirectTo);
    }
}

/**
 * Require client role - redirect to dashboard if staff/admin
 */
export async function requireClient() {
    const user = await requireAuth();
    
    try {
        const supabase = await createClient();
        let userRole = 'client'; // default

        // Try safe function first
        const { data: roleResult, error: roleError } = await supabase
            .rpc('get_user_role_safe', { user_id: user.id });

        if (roleError) {
            console.error('Client requirement check with safe function failed:', roleError);
            // Fallback: try direct profile access
            try {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (!profileError && profile) {
                    userRole = profile.role;
                }
            } catch (fallbackError) {
                console.error('Fallback client check failed:', fallbackError);
                userRole = 'client'; // safe default
            }
        } else {
            userRole = roleResult || 'client';
        }

        if (userRole !== 'client') {
            redirect('/dashboard');
        }

        // Return a minimal profile object
        return {
            id: user.id,
            role: userRole as UserRole,
            full_name: user.email?.split('@')[0] || null,
            phone: null,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        } as UserProfile;
    } catch (error) {
        console.error('Client requirement check failed:', error);
        // Safe fallback - assume client role
        return {
            id: user.id,
            role: 'client' as UserRole,
            full_name: user.email?.split('@')[0] || null,
            phone: null,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        } as UserProfile;
    }
}

/**
 * Require staff or admin role - redirect to client portal if client
 */
export async function requireStaff() {
    const user = await requireAuth();
    
    try {
        const supabase = await createClient();
        let userRole = 'client'; // default

        // Try safe function first
        const { data: roleResult, error: roleError } = await supabase
            .rpc('get_user_role_safe', { user_id: user.id });

        if (roleError) {
            console.error('Staff requirement check with safe function failed:', roleError);
            // Fallback: try direct profile access
            try {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (!profileError && profile) {
                    userRole = profile.role;
                }
            } catch (fallbackError) {
                console.error('Fallback staff check failed:', fallbackError);
                userRole = 'client'; // safe default
            }
        } else {
            userRole = roleResult || 'client';
        }

        if (userRole === 'client') {
            redirect('/client');
        }

        // Return a minimal profile object
        return {
            id: user.id,
            role: userRole as UserRole,
            full_name: user.email?.split('@')[0] || null,
            phone: null,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        } as UserProfile;
    } catch (error) {
        console.error('Staff requirement check failed:', error);
        // Safe fallback - redirect to client
        redirect('/client');
    }
}

/**
 * Get client record for current user
 */
export async function getClientRecord() {
    const supabase = await createClient();
    const user = await getCurrentUser();

    if (!user) return null;

    // First verify this is a client user
    const { data: roleResult, error: roleError } = await supabase
        .rpc('get_user_role_safe', { user_id: user.id });

    if (roleError || roleResult !== 'client') {
        console.error('Error verifying client role:', roleError);
        return null;
    }

    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error) {
        console.error('Error fetching client record:', error);
        return null;
    }

    return data;
}

/**
 * Create or update user profile
 */
export async function upsertProfile(userId: string, profileData: Partial<UserProfile>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            ...profileData,
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to upsert profile: ${error.message}`);
    }

    return data;
}

/**
 * Sign out user
 */
export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}
