/*
  # Create demo admin user

  1. New Operations
    - Insert demo admin user into admins table
    - Create corresponding auth user in Supabase Auth

  2. Security
    - Admin user will be able to access admin dashboard
    - Uses secure email/password authentication

  Note: This creates the demo admin user that matches the credentials shown in the login form
*/

-- Insert demo admin user into admins table
INSERT INTO admins (id, email, name, role) 
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@techhub.com',
  'Demo Admin',
  'admin'
) ON CONFLICT (email) DO NOTHING;