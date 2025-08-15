/*
  # Seed Initial Data

  1. Categories
    - Insert initial product categories
  
  2. Products
    - Insert sample products for demonstration
  
  3. Admin User
    - Create initial admin user
*/

-- Insert categories
INSERT INTO categories (name, slug, description, image, icon) VALUES
('Laptops', 'laptops', 'Professional and gaming laptops', 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800', 'Laptop'),
('Desktops', 'desktops', 'Custom and pre-built desktop systems', 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800', 'Monitor'),
('Components', 'components', 'CPUs, GPUs, RAM, and more', 'https://images.pexels.com/photos/2399840/pexels-photo-2399840.jpeg?auto=compress&cs=tinysrgb&w=800', 'Cpu'),
('Peripherals', 'peripherals', 'Keyboards, mice, monitors, and accessories', 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800', 'Keyboard'),
('Gaming', 'gaming', 'Gaming gear and accessories', 'https://images.pexels.com/photos/7915483/pexels-photo-7915483.jpeg?auto=compress&cs=tinysrgb&w=800', 'Gamepad2'),
('Networking', 'networking', 'Routers, switches, and network equipment', 'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg?auto=compress&cs=tinysrgb&w=800', 'Wifi')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (
  sku, name, slug, brand, price, original_price, images, category_id, 
  short_description, description, specifications, stock, featured, warranty, condition
) VALUES
(
  'LAP001',
  'MacBook Pro 14-inch M3',
  'macbook-pro-14-m3',
  'Apple',
  1999.00,
  2299.00,
  '["https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1200", "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  (SELECT id FROM categories WHERE slug = 'laptops'),
  'Powerful professional laptop with M3 chip',
  'The MacBook Pro 14-inch with M3 chip delivers exceptional performance for professionals and creators. Features advanced graphics, all-day battery life, and stunning Liquid Retina XDR display.',
  '{"Processor": "Apple M3 8-core CPU", "Memory": "16GB Unified Memory", "Storage": "512GB SSD", "Display": "14.2-inch Liquid Retina XDR", "Graphics": "10-core GPU", "Battery": "Up to 22 hours", "Weight": "3.5 lbs", "Ports": "3x Thunderbolt 4, HDMI, SD card"}'::jsonb,
  5,
  true,
  '1 Year Apple Warranty',
  'new'
),
(
  'GPU001',
  'NVIDIA RTX 4080 Graphics Card',
  'nvidia-rtx-4080',
  'NVIDIA',
  1199.00,
  NULL,
  '["https://images.pexels.com/photos/2399840/pexels-photo-2399840.jpeg?auto=compress&cs=tinysrgb&w=1200", "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  (SELECT id FROM categories WHERE slug = 'components'),
  'High-performance graphics card for gaming and content creation',
  'Experience exceptional gaming and content creation with the RTX 4080. Features advanced ray tracing, DLSS 3, and massive 16GB GDDR6X memory.',
  '{"GPU": "NVIDIA GeForce RTX 4080", "Memory": "16GB GDDR6X", "Memory Bus": "256-bit", "Boost Clock": "2.51 GHz", "CUDA Cores": "9728", "RT Cores": "76 (3rd Gen)", "Tensor Cores": "304 (4th Gen)", "Power": "320W TGP"}'::jsonb,
  3,
  true,
  '3 Year Manufacturer Warranty',
  'new'
),
(
  'KEY001',
  'Mechanical Gaming Keyboard RGB',
  'mechanical-gaming-keyboard-rgb',
  'SteelSeries',
  149.00,
  NULL,
  '["https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=1200", "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  (SELECT id FROM categories WHERE slug = 'peripherals'),
  'Professional mechanical keyboard with RGB lighting',
  'Premium mechanical gaming keyboard featuring customizable RGB lighting, tactile switches, and durable construction for competitive gaming.',
  '{"Switch Type": "Mechanical Red Switches", "Backlighting": "Per-key RGB", "Layout": "Full-size (104 keys)", "Connection": "USB-C Wired", "Polling Rate": "1000Hz", "Key Life": "50 million keystrokes", "Software": "SteelSeries Engine", "Cable Length": "6 feet braided"}'::jsonb,
  12,
  false,
  '2 Year Limited Warranty',
  'new'
)
ON CONFLICT (sku) DO NOTHING;