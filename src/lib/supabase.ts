import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging for environment variables
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);
console.log('Supabase Key length:', supabaseAnonKey?.length || 0);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  console.error('Current VITE_SUPABASE_URL:', supabaseUrl);
  console.error('Current VITE_SUPABASE_ANON_KEY exists:', !!supabaseAnonKey);
  throw new Error('Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly.');
}

if (supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.error('Supabase environment variables are still using placeholder values.');
  console.error('Please update your .env file with actual Supabase credentials from your project dashboard.');
  console.error('Go to: https://supabase.com/dashboard → Your Project → Settings → API');
  throw new Error('Supabase environment variables are using placeholder values. Please update your .env file with actual credentials.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  console.error('Invalid Supabase URL format:', supabaseUrl);
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Please check your VITE_SUPABASE_URL in .env file.`);
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
});

// Auth helpers
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Sign in error:', error);
    }
    return { data, error };
  } catch (error) {
    console.error('Network error during sign in:', error);
    return { data: null, error: { message: 'Network connection failed. Please check your internet connection and Supabase configuration.' } };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Network error during sign out:', error);
    return { error: { message: 'Network connection failed during sign out.' } };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
    }
    return { user, error };
  } catch (error) {
    console.error('Network error getting current user:', error);
    return { user: null, error: { message: 'Network connection failed. Please check your internet connection and Supabase configuration.' } };
  }
};

// Check if user is admin
export const isAdmin = async (userId: string) => {
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!userId || !uuidRegex.test(userId)) {
    console.log('Invalid user ID format:', userId);
    return { isAdmin: false, role: null, error: new Error('Invalid user ID format') };
  }

  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id, role')
      .eq('id', userId)
      .maybeSingle();
    
    console.log('Admin check result:', { userId, data, error });
    
    if (error) {
      console.error('Database error checking admin status:', error);
      return { isAdmin: false, role: null, error };
    }
    
    const isAdminUser = !!data;
    const userRole = data?.role || null;
    
    console.log('Final admin status:', { isAdminUser, userRole });
    return { isAdmin: isAdminUser, role: userRole, error: null };
  } catch (err) {
    console.error('Network error checking admin status:', err);
    return { isAdmin: false, role: null, error: err };
  }
};