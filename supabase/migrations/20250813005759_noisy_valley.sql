/*
  # Create site settings table

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key)
      - `site_name` (text)
      - `site_tagline` (text)
      - `site_description` (text)
      - `logo_url` (text)
      - `address` (text)
      - `phone` (text)
      - `whatsapp` (text)
      - `email` (text)
      - `hours` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `site_settings` table
    - Add policies for admins to manage settings
    - Add policy for public to read settings
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'TechHub Pro',
  site_tagline text NOT NULL DEFAULT 'Your Complete Technology Solution',
  site_description text NOT NULL DEFAULT 'Professional computer and technology store offering the latest hardware, components, and expert services.',
  logo_url text,
  address text NOT NULL DEFAULT '123 Tech Street, Digital City, DC 12345',
  phone text NOT NULL DEFAULT '+1 (555) 123-4567',
  whatsapp text NOT NULL DEFAULT '+1 (555) 123-4567',
  email text NOT NULL DEFAULT 'info@techhubpro.com',
  hours text NOT NULL DEFAULT 'Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 12PM-5PM',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Insert default settings
INSERT INTO site_settings (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Policies
CREATE POLICY "Site settings are viewable by everyone"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Site settings are editable by admins"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM admins));

-- Update trigger
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();