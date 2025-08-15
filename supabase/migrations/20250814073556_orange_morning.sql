/*
  # Fix site settings policies and ensure proper data structure

  1. Drop existing policies that might be causing issues
  2. Create new, simpler policies
  3. Insert default settings if none exist
  4. Update trigger function
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Site settings are editable by admins" ON site_settings;
DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON site_settings;

-- Create new policies
CREATE POLICY "Anyone can view site settings"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();

-- Insert default settings if none exist
INSERT INTO site_settings (
  site_name,
  site_tagline,
  site_description,
  address,
  phone,
  whatsapp,
  email,
  hours
)
SELECT 
  'TechHub Pro',
  'Your Complete Technology Solution',
  'Professional computer and technology store offering the latest hardware, components, and expert services.',
  '123 Tech Street, Digital City, DC 12345',
  '+1 (555) 123-4567',
  '+1 (555) 123-4567',
  'info@techhubpro.com',
  'Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 12PM-5PM'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);