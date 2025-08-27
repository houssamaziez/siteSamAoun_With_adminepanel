/*
  # Add missing map columns to site_settings table

  1. New Columns
    - `map_latitude` (double precision, nullable) - Latitude coordinate for map location
    - `map_longitude` (double precision, nullable) - Longitude coordinate for map location  
    - `map_zoom` (integer, nullable) - Zoom level for map display
    - `map_url` (text, nullable) - Custom map URL for location

  2. Default Values
    - All columns are nullable to allow gradual adoption
    - No default values to maintain flexibility
*/

-- Add map-related columns to site_settings table
DO $$
BEGIN
  -- Add map_latitude column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'map_latitude'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN map_latitude double precision;
  END IF;

  -- Add map_longitude column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'map_longitude'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN map_longitude double precision;
  END IF;

  -- Add map_zoom column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'map_zoom'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN map_zoom integer;
  END IF;

  -- Add map_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'map_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN map_url text;
  END IF;
END $$;