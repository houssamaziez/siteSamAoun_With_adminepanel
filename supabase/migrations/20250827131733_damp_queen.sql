/*
  # Add map settings to site_settings table

  1. New Columns
    - `map_url` (text) - Google Maps embed URL
    - `map_latitude` (numeric) - Latitude coordinate
    - `map_longitude` (numeric) - Longitude coordinate  
    - `map_zoom` (integer) - Map zoom level

  2. Default Values
    - Set default coordinates for Algiers, Algeria
    - Set default zoom level to 15
*/

-- Add map-related columns to site_settings table
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS map_url text,
ADD COLUMN IF NOT EXISTS map_latitude numeric(10,8),
ADD COLUMN IF NOT EXISTS map_longitude numeric(11,8),
ADD COLUMN IF NOT EXISTS map_zoom integer DEFAULT 15;

-- Update existing records with default values (Algiers, Algeria)
UPDATE site_settings 
SET 
  map_url = 'https://maps.google.com/maps?q=36.7538,3.0588&z=15&output=embed',
  map_latitude = 36.7538,
  map_longitude = 3.0588,
  map_zoom = 15
WHERE map_url IS NULL;