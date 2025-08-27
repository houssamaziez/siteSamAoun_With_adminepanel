/*
  # تحديث الموقع الافتراضي للخريطة

  1. إعدادات الموقع
    - تحديث الإحداثيات الافتراضية للجزائر العاصمة
    - إضافة Google Maps API Key
    - تفعيل الاتجاهات

  2. الأمان
    - تحديث الإعدادات الموجودة فقط
*/

-- تحديث أو إدراج إعدادات الموقع الافتراضية
INSERT INTO site_settings (
  id,
  site_name,
  site_tagline,
  site_description,
  address,
  phone,
  whatsapp,
  email,
  hours,
  hero_title,
  hero_subtitle,
  hero_description,
  footer_description,
  copyright_text,
  meta_keywords,
  meta_author,
  primary_color,
  secondary_color,
  accent_color,
  testimonials_title,
  testimonials_description,
  newsletter_title,
  newsletter_description,
  stat_products_count,
  stat_customers_count,
  stat_satisfaction_rate,
  stat_support_availability,
  map_latitude,
  map_longitude,
  map_zoom,
  google_maps_api_key,
  map_type,
  enable_directions
) VALUES (
  gen_random_uuid(),
  'TechHub Pro',
  'Your Complete Technology Solution',
  'Professional computer and technology store offering the latest hardware, components, and expert services.',
  '123 Tech Street, Digital City, DC 12345',
  '+1 (555) 123-4567',
  '+1 (555) 123-4567',
  'info@techhubpro.com',
  'Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 12PM-5PM',
  'Your Complete Technology Solution',
  'Professional computer and technology store offering the latest hardware, components, and expert services.',
  'From cutting-edge laptops to custom builds, we have everything you need.',
  'Professional computer and technology store offering the latest hardware, components, and expert services.',
  'All rights reserved.',
  'computers, technology, hardware, software, gaming, laptops, desktops',
  'TechHub Pro',
  '#2563eb',
  '#64748b',
  '#10b981',
  'What Our Customers Say',
  'Don''t just take our word for it. Here''s what real customers have to say.',
  'Stay Updated',
  'Get the latest deals, product launches, and tech news delivered to your inbox.',
  '500+',
  '1000+',
  '99%',
  '24/7',
  36.7538,
  3.0588,
  15,
  'AIzaSyDV0zNlb2O-blUSUJF6XgOmeJ-QeC2qeos',
  'google',
  true
) ON CONFLICT (id) DO UPDATE SET
  map_latitude = EXCLUDED.map_latitude,
  map_longitude = EXCLUDED.map_longitude,
  map_zoom = EXCLUDED.map_zoom,
  google_maps_api_key = EXCLUDED.google_maps_api_key,
  map_type = EXCLUDED.map_type,
  enable_directions = EXCLUDED.enable_directions;

-- تحديث الإعدادات الموجودة إذا لم تكن الإحداثيات محددة
UPDATE site_settings 
SET 
  map_latitude = 36.7538,
  map_longitude = 3.0588,
  map_zoom = 15,
  google_maps_api_key = 'AIzaSyDV0zNlb2O-blUSUJF6XgOmeJ-QeC2qeos',
  map_type = 'google',
  enable_directions = true
WHERE map_latitude IS NULL OR map_longitude IS NULL;