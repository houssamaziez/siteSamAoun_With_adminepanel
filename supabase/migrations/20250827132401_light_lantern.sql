/*
  # Add Google Maps API and location settings

  1. New Columns
    - `google_maps_api_key` (text, nullable) - Google Maps API key for enhanced features
    - `map_type` (text, default 'google') - Type of map service to use
    - `enable_directions` (boolean, default false) - Enable directions functionality

  2. Security
    - All columns are nullable to allow gradual adoption
    - Default values provided for new installations
*/

-- Add Google Maps API key column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'google_maps_api_key'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN google_maps_api_key text;
  END IF;
END $$;

-- Add map type column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'map_type'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN map_type text DEFAULT 'google';
  END IF;
END $$;

-- Add enable directions column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'enable_directions'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN enable_directions boolean DEFAULT false;
  END IF;
END $$;

-- Add check constraint for map_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'site_settings' AND constraint_name = 'site_settings_map_type_check'
  ) THEN
    ALTER TABLE site_settings ADD CONSTRAINT site_settings_map_type_check 
    CHECK (map_type IN ('google', 'openstreetmap'));
  END IF;
END $$;