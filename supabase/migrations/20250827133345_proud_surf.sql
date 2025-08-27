/*
  # Set Google Maps API Key

  1. Updates
    - Set the Google Maps API key in site_settings table
    - Enable directions functionality
    - Set map type to Google Maps

  2. Configuration
    - API Key: AIzaSyDV0zNlb2O-blUSUJF6XgOmeJ-QeC2qeos
    - Map Type: google
    - Directions: enabled
*/

-- Update or insert the Google Maps API key
INSERT INTO site_settings (
  id,
  google_maps_api_key,
  map_type,
  enable_directions
) VALUES (
  gen_random_uuid(),
  'AIzaSyDV0zNlb2O-blUSUJF6XgOmeJ-QeC2qeos',
  'google',
  true
)
ON CONFLICT (id) DO UPDATE SET
  google_maps_api_key = EXCLUDED.google_maps_api_key,
  map_type = EXCLUDED.map_type,
  enable_directions = EXCLUDED.enable_directions,
  updated_at = now();

-- If no site_settings exist, create a default record
INSERT INTO site_settings (
  google_maps_api_key,
  map_type,
  enable_directions
) 
SELECT 
  'AIzaSyDV0zNlb2O-blUSUJF6XgOmeJ-QeC2qeos',
  'google',
  true
WHERE NOT EXISTS (SELECT 1 FROM site_settings);