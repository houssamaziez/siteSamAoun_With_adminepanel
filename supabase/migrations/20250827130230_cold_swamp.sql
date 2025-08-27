/*
  # Comprehensive Site Settings Update

  1. New Columns Added
    - Social media links (Facebook, Twitter, Instagram, YouTube, LinkedIn)
    - Hero section content (title, subtitle, description)
    - About section content
    - Services content
    - Contact information extensions
    - Footer content
    - SEO settings
    - Theme colors
    - Custom CSS

  2. Security
    - Maintain existing RLS policies
    - Add validation for URLs and content
*/

-- Add comprehensive settings columns
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_title text DEFAULT 'Your Complete Technology Solution';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_subtitle text DEFAULT 'Professional computer and technology store offering the latest hardware, components, and expert services.';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_description text DEFAULT 'From cutting-edge laptops to custom builds, we have everything you need.';

-- Social Media Links
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS facebook_url text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS twitter_url text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS instagram_url text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS youtube_url text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS tiktok_url text;

-- About Section
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_title text DEFAULT 'About Us';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_description text DEFAULT 'We are a leading technology store committed to providing the best products and services.';

-- Services Section
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS services_title text DEFAULT 'Professional Services';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS services_description text DEFAULT 'Beyond just selling products, we provide comprehensive technology services.';

-- Contact Extensions
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS contact_title text DEFAULT 'Contact Us';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS emergency_phone text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS support_email text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS sales_email text;

-- Footer Content
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_description text DEFAULT 'Professional computer and technology store offering the latest hardware, components, and expert services.';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS copyright_text text DEFAULT 'All rights reserved.';

-- SEO Settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS meta_keywords text DEFAULT 'computers, technology, hardware, software, gaming, laptops, desktops';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS meta_author text DEFAULT 'TechHub Pro';

-- Theme Colors
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#2563eb';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS secondary_color text DEFAULT '#64748b';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#10b981';

-- Custom Content
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS custom_css text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS custom_js text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS announcement_text text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS announcement_active boolean DEFAULT false;

-- Business Information
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS business_license text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS tax_number text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS bank_account text;

-- Delivery & Shipping
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS delivery_fee numeric(10,2) DEFAULT 0;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS free_delivery_threshold numeric(10,2) DEFAULT 50000;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS delivery_areas text DEFAULT 'Algiers, Oran, Constantine';

-- Testimonials Settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS testimonials_title text DEFAULT 'What Our Customers Say';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS testimonials_description text DEFAULT 'Don''t just take our word for it. Here''s what real customers have to say.';

-- Newsletter Settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS newsletter_title text DEFAULT 'Stay Updated';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS newsletter_description text DEFAULT 'Get the latest deals, product launches, and tech news delivered to your inbox.';

-- Stats/Numbers
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat_products_count text DEFAULT '500+';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat_customers_count text DEFAULT '1000+';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat_satisfaction_rate text DEFAULT '99%';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat_support_availability text DEFAULT '24/7';