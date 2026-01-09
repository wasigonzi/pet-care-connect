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

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !data) {
        return null;
    }

    return data as UserProfile;
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: UserRole | UserRole[]): Promise<boolean> {
    const profile = await getUserProfile();
    if (!profile) return false;

    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(profile.role);
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
    const hasRequiredRole = await hasRole(role);

    if (!hasRequiredRole) {
        redirect(redirectTo);
    }
}

/**
 * Require client role - redirect to dashboard if staff/admin
 */
export async function requireClient() {
    await requireAuth();
    const profile = await getUserProfile();

    if (!profile) {
        redirect('/login');
    }

    if (profile.role !== 'client') {
        redirect('/dashboard');
    }

    return profile;
}

/**
 * Require staff or admin role - redirect to client portal if client
 */
export async function requireStaff() {
    await requireAuth();
    const profile = await getUserProfile();

    if (!profile) {
        redirect('/login');
    }

    if (profile.role === 'client') {
        redirect('/client');
    }

    return profile;
}

/**
 * Get client record for current user
 */
export async function getClientRecord() {
    const supabase = await createClient();
    const user = await getCurrentUser();

    if (!user) return null;

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
