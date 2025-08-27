/*
  # Create Default Administrator Account

  1. New Admin User
    - Creates a default admin user with email: admin@techhub.com
    - Password will be set to: admin123 (should be changed after first login)
    - Role: admin (full access)
    - Name: System Administrator

  2. Security
    - User will be created in both auth.users and admins table
    - Can be used immediately to access admin panel
    - Recommended to change password after first login

  Note: This creates a default admin account for immediate access to the admin panel.
*/

-- Insert default admin user into auth.users table
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '00000000-0000-0000-0000-000000000000',
  'admin@techhub.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert admin user into admins table
INSERT INTO admins (
  id,
  email,
  name,
  role,
  created_at
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'admin@techhub.com',
  'System Administrator',
  'admin',
  now()
) ON CONFLICT (id) DO NOTHING;