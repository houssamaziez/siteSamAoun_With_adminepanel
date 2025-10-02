import { Product, ProductCategory, Store } from '../types';

export const store: Store = {
  name: "كورتك باتنة",
  tagline: "حلولك التقنية الشاملة",
  description: "متجر كمبيوتر وتكنولوجيا احترافي يقدم أحدث الأجهزة والمكونات والخدمات المتخصصة.",
  address: "شارع التقنية 123، المدينة الرقمية، باتنة",
  phone: "+1 (555) 123-4567",
  whatsapp: "+1 (555) 123-4567",
  email: "info@techhubpro.com",
  hours: "الإثنين-الجمعة: 9ص-7م، السبت: 10ص-6م، الأحد: 12ظ-5م",
  services: ["تركيب الأجهزة", "صيانة الأنظمة", "التجميع المخصص", "استرداد البيانات", "الدعم التقني", "خدمة الضمان"]
};

export const categories: ProductCategory[] = [
  {
    id: "1",
    name: "أجهزة لابتوب",
    slug: "laptops",
    description: "أجهزة لابتوب احترافية وللألعاب",
    image: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: "Laptop"
  },
  {
    id: "2",
    name: "أجهزة مكتبية",
    slug: "desktops",
    description: "أنظمة مكتبية مخصصة ومُجمعة مسبقاً",
    image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: "Monitor"
  },
  {
    id: "3",
    name: "المكونات",
    slug: "components",
    description: "معالجات، كروت رسومات، ذاكرة، والمزيد",
    image: "https://images.pexels.com/photos/2399840/pexels-photo-2399840.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: "Cpu"
  },
  {
    id: "4",
    name: "الملحقات",
    slug: "peripherals",
    description: "لوحات مفاتيح، فأرات، شاشات، وإكسسوارات",
    image: "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: "Keyboard"
  },
  {
    id: "5",
    name: "الألعاب",
    slug: "gaming",
    description: "معدات وإكسسوارات الألعاب",
    image: "https://images.pexels.com/photos/7915483/pexels-photo-7915483.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: "Gamepad2"
  },
 
];

export const products: Product[] = [
  {
    id: "1",
    sku: "LAP001",
    name: "ماك بوك برو 14 بوصة M3",
    slug: "macbook-pro-14-m3",
    brand: "Apple",
    price: 1999,
    originalPrice: 2299,
    currency: "DZD",
    images: [
      "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    category: categories[0],
    shortDescription: "لابتوب احترافي قوي بمعالج M3",
    description: "يقدم ماك بوك برو 14 بوصة بمعالج M3 أداءً استثنائياً للمحترفين والمبدعين. يتميز برسومات متقدمة وبطارية تدوم طوال اليوم وشاشة Liquid Retina XDR مذهلة.",
    specifications: {
      "المعالج": "Apple M3 8-core CPU",
      "Memory": "16GB Unified Memory",
      "Storage": "512GB SSD",
      "Display": "14.2-inch Liquid Retina XDR",
      "Graphics": "10-core GPU",
      "Battery": "Up to 22 hours",
      "Weight": "3.5 lbs",
      "Ports": "3x Thunderbolt 4, HDMI, SD card"
    },
    stock: 5,
    status: 'active',
    featured: true,
    warranty: "ضمان آبل لمدة سنة واحدة",
    condition: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    sku: "GPU001",
    name: "كارت رسومات NVIDIA RTX 4080",
    slug: "nvidia-rtx-4080",
    brand: "NVIDIA",
    price: 1199,
    currency: "DZD",
    images: [
      "https://images.pexels.com/photos/2399840/pexels-photo-2399840.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200"
    ],
    category: categories[2],
    shortDescription: "كارت رسومات عالي الأداء للألعاب وإنشاء المحتوى",
    description: "استمتع بتجربة ألعاب وإنشاء محتوى استثنائية مع RTX 4080. يتميز بتتبع الأشعة المتقدم وDLSS 3 وذاكرة 16GB GDDR6X ضخمة.",
    specifications: {
      "كارت الرسومات": "NVIDIA GeForce RTX 4080",
      "Memory": "16GB GDDR6X",
      "Memory Bus": "256-bit",
      "Boost Clock": "2.51 GHz",
      "CUDA Cores": "9728",
      "RT Cores": "76 (3rd Gen)",
      "Tensor Cores": "304 (4th Gen)",
      "Power": "320W TGP"
    },
    stock: 3,
    status: 'active',
    featured: true,
    warranty: "ضمان الشركة المصنعة لمدة 3 سنوات",
    condition: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    sku: "KEY001",
    name: "Mechanical Gaming Keyboard RGB",
    slug: "mechanical-gaming-keyboard-rgb",
    brand: "SteelSeries",
    price: 149,
    currency: "DZD",
    images: [
      "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    category: categories[3],
    shortDescription: "Professional mechanical keyboard with RGB lighting",
    description: "Premium mechanical gaming keyboard featuring customizable RGB lighting, tactile switches, and durable construction for competitive gaming.",
    specifications: {
      "Switch Type": "Mechanical Red Switches",
      "Backlighting": "Per-key RGB",
      "Layout": "Full-size (104 keys)",
      "Connection": "USB-C Wired",
      "Polling Rate": "1000Hz",
      "Key Life": "50 million keystrokes",
      "Software": "SteelSeries Engine",
      "Cable Length": "6 feet braided"
    },
    stock: 12,
    status: 'active',
    featured: false,
    warranty: "2 Year Limited Warranty",
    condition: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    sku: "MON001",
    name: "4K UHD Gaming Monitor 32-inch",
    slug: "4k-gaming-monitor-32inch",
    brand: "ASUS",
    price: 699,
    originalPrice: 799,
    currency: "DZD",
    images: [
      "https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    category: categories[3],
    shortDescription: "Ultra HD gaming monitor with high refresh rate",
    description: "Immersive 32-inch 4K gaming monitor with 144Hz refresh rate, HDR support, and ultra-low input lag for competitive gaming.",
    specifications: {
      "Screen Size": "32 inches",
      "Resolution": "3840 x 2160 (4K UHD)",
      "Refresh Rate": "144Hz",
      "Response Time": "1ms GTG",
      "Panel Type": "IPS",
      "HDR": "HDR10, DisplayHDR 600",
      "Connectivity": "HDMI 2.1, DisplayPort 1.4, USB-C",
      "Stand": "Adjustable height, tilt, swivel"
    },
    stock: 7,
    status: 'active',
    featured: true,
    warranty: "3 Year Manufacturer Warranty",
    condition: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    sku: "CPU001",
    name: "AMD Ryzen 9 7900X Processor",
    slug: "amd-ryzen-9-7900x",
    brand: "AMD",
    price: 549,
    currency: "DZD",
    images: [
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/2399840/pexels-photo-2399840.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    category: categories[2],
    shortDescription: "High-performance CPU for gaming and content creation",
    description: "Powerful 12-core processor built for demanding workloads, gaming, and content creation with exceptional multi-threaded performance.",
    specifications: {
      "Cores": "12",
      "Threads": "24",
      "Base Clock": "4.7 GHz",
      "Boost Clock": "5.6 GHz",
      "Cache": "76MB Total",
      "Socket": "AM5",
      "Architecture": "Zen 4",
      "Process": "5nm TSMC"
    },
    stock: 8,
    status: 'active',
    featured: false,
    warranty: "3 Year AMD Warranty",
    condition: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: "6",
    sku: "HDT001",
    name: "Gaming Headset with 7.1 Surround",
    slug: "gaming-headset-surround",
    brand: "Logitech",
    price: 199,
    currency: "DZD",
    images: [
      "https://images.pexels.com/photos/7915483/pexels-photo-7915483.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    category: categories[4],
    shortDescription: "Professional gaming headset with surround sound",
    description: "Premium gaming headset featuring 7.1 surround sound, noise-cancelling microphone, and comfortable design for extended gaming sessions.",
    specifications: {
      "Driver": "50mm Pro-G",
      "Frequency Response": "20Hz - 20KHz",
      "Surround Sound": "DTS Headphone:X 2.0",
      "Microphone": "Detachable boom mic",
      "Connection": "USB + 3.5mm",
      "Weight": "342g",
      "Battery": "Up to 20 hours wireless",
      "Compatibility": "PC, Mac, PlayStation, Xbox"
    },
    stock: 15,
    status: 'active',
    featured: false,
    warranty: "2 Year Limited Warranty",
    condition: 'new',
    createdAt: new Date().toISOString()
  }
];

export const testimonials = [
  {
    id: "1",
    name: "سعاد",
    role: "Graphic Designe",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
    rating: 5,
    text: "متجر رائع مع أسعار رائعة جدا و مناسبة يستحق أفضل تقييم.  \nشكراcortec"
  },
  {
    id: "2",
    name: "Danial",
    role: "Software Developer",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    rating: 5,
    text: "Good prices and hospitality and of course best products"
  },
  {
    id: "3",
    name: "Malak",
    role: "Content Creator",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    rating: 5,
    text: "Amazing experience! They helped me choose the perfect gaming setup for streaming. The performance is incredible and the customer support is top-notch."
  }
];