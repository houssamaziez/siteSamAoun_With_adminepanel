/*
  # Create Default Admin User

  1. Authentication User
    - Creates admin user in Supabase Auth with email and password
    - Sets up proper authentication credentials
  
  2. Admin Entry
    - Links the auth user to admin permissions table
    - Assigns full admin role and permissions
  
  3. Security
    - Uses secure password hashing
    - Enables proper authentication flow
*/

-- First, we need to create the admin user in auth.users table
-- This requires using Supabase's built-in functions

-- Insert the admin user into auth.users (this creates the authentication record)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@techhub.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin User"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Now insert into our admins table using the created user's ID
INSERT INTO public.admins (
  id,
  email,
  name,
  role,
  created_at
)
SELECT 
  id,
  'admin@techhub.com',
  'Admin User',
  'admin',
  NOW()
FROM auth.users 
WHERE email = 'admin@techhub.com'
ON CONFLICT (email) DO NOTHING;

-- Ensure the admin user is confirmed and can sign in
UPDATE auth.users 
SET 
  email_confirmed_at = NOW(),
  email_change_confirm_status = 1
WHERE email = 'admin@techhub.com';