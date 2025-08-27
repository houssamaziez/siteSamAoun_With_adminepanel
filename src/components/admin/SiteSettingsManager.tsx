import React, { useState } from 'react';
import { Save, Globe, MapPin, Phone, Mail, Clock, Palette, Share2, Settings2, DollarSign, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { LocationPicker } from '../ui/LocationPicker';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export function SiteSettingsManager() {
  const { settings, loading, error, updateSettings } = useSiteSettings();
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'social' | 'content' | 'business' | 'theme'>('general');
  const [formData, setFormData] = useState({
    // General Settings
    siteName: '',
    siteTagline: '',
    siteDescription: '',
    logoUrl: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    hours: '',
    
    // Hero Section
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    
    // Social Media
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    linkedinUrl: '',
    tiktokUrl: '',
    
    // Content Sections
    aboutTitle: '',
    aboutDescription: '',
    servicesTitle: '',
    servicesDescription: '',
    contactTitle: '',
    testimonialsTitle: '',
    testimonialsDescription: '',
    newsletterTitle: '',
    newsletterDescription: '',
    footerDescription: '',
    copyrightText: '',
    
    // Business Information
    emergencyPhone: '',
    supportEmail: '',
    salesEmail: '',
    businessLicense: '',
    taxNumber: '',
    bankAccount: '',
    deliveryFee: '',
    freeDeliveryThreshold: '',
    deliveryAreas: '',
    
    // Statistics
    statProductsCount: '',
    statCustomersCount: '',
    statSatisfactionRate: '',
    statSupportAvailability: '',
    
    // Theme & SEO
    primaryColor: '',
    secondaryColor: '',
    accentColor: '',
    metaKeywords: '',
    metaAuthor: '',
    customCss: '',
    customJs: '',
    announcementText: '',
    announcementActive: false,
    mapUrl: '',
    mapLatitude: '',
    mapLongitude: '',
    mapZoom: '',
    googleMapsApiKey: '',
    mapType: 'google' as 'google' | 'openstreetmap',
    enableDirections: false
  });
  
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update form data when settings load
  React.useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || '',
        siteTagline: settings.siteTagline || '',
        siteDescription: settings.siteDescription || '',
        logoUrl: settings.logoUrl || '',
        address: settings.address || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        hours: settings.hours || '',
        heroTitle: settings.heroTitle || '',
        heroSubtitle: settings.heroSubtitle || '',
        heroDescription: settings.heroDescription || '',
        facebookUrl: settings.facebookUrl || '',
        twitterUrl: settings.twitterUrl || '',
        instagramUrl: settings.instagramUrl || '',
        youtubeUrl: settings.youtubeUrl || '',
        linkedinUrl: settings.linkedinUrl || '',
        tiktokUrl: settings.tiktokUrl || '',
        aboutTitle: settings.aboutTitle || '',
        aboutDescription: settings.aboutDescription || '',
        servicesTitle: settings.servicesTitle || '',
        servicesDescription: settings.servicesDescription || '',
        contactTitle: settings.contactTitle || '',
        testimonialsTitle: settings.testimonialsTitle || '',
        testimonialsDescription: settings.testimonialsDescription || '',
        newsletterTitle: settings.newsletterTitle || '',
        newsletterDescription: settings.newsletterDescription || '',
        footerDescription: settings.footerDescription || '',
        copyrightText: settings.copyrightText || '',
        emergencyPhone: settings.emergencyPhone || '',
        supportEmail: settings.supportEmail || '',
        salesEmail: settings.salesEmail || '',
        businessLicense: settings.businessLicense || '',
        taxNumber: settings.taxNumber || '',
        bankAccount: settings.bankAccount || '',
        deliveryFee: settings.deliveryFee?.toString() || '',
        freeDeliveryThreshold: settings.freeDeliveryThreshold?.toString() || '',
        deliveryAreas: settings.deliveryAreas || '',
        statProductsCount: settings.statProductsCount || '',
        statCustomersCount: settings.statCustomersCount || '',
        statSatisfactionRate: settings.statSatisfactionRate || '',
        statSupportAvailability: settings.statSupportAvailability || '',
        primaryColor: settings.primaryColor || '',
        secondaryColor: settings.secondaryColor || '',
        accentColor: settings.accentColor || '',
        metaKeywords: settings.metaKeywords || '',
        metaAuthor: settings.metaAuthor || '',
        customCss: settings.customCss || '',
        customJs: settings.customJs || '',
        announcementText: settings.announcementText || '',
        announcementActive: settings.announcementActive || false,
        mapUrl: settings.mapUrl || '',
        mapLatitude: settings.mapLatitude?.toString() || '',
        mapLongitude: settings.mapLongitude?.toString() || '',
        mapZoom: settings.mapZoom?.toString() || '',
        googleMapsApiKey: settings.googleMapsApiKey || '',
        mapType: settings.mapType || 'google',
        enableDirections: settings.enableDirections || false
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const updates = {
      ...formData,
      deliveryFee: formData.deliveryFee ? parseFloat(formData.deliveryFee) : 0,
      freeDeliveryThreshold: formData.freeDeliveryThreshold ? parseFloat(formData.freeDeliveryThreshold) : 0,
      mapLatitude: formData.mapLatitude ? parseFloat(formData.mapLatitude) : null,
      mapLongitude: formData.mapLongitude ? parseFloat(formData.mapLongitude) : null,
      mapZoom: formData.mapZoom ? parseInt(formData.mapZoom) : null,
      googleMapsApiKey: formData.googleMapsApiKey,
      mapType: formData.mapType,
      enableDirections: formData.enableDirections
    };

    const result = await updateSettings(updates);
    
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError(result.error || 'Failed to save settings');
    }
    
    setSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const tabs = [
    { id: 'general', label: 'عام', icon: Globe },
    { id: 'hero', label: 'الصفحة الرئيسية', icon: Settings2 },
    { id: 'location', label: 'الموقع والخريطة', icon: MapPin },
    { id: 'social', label: 'وسائل التواصل', icon: Share2 },
    { id: 'content', label: 'المحتوى', icon: Mail },
    { id: 'business', label: 'معلومات العمل', icon: DollarSign },
    { id: 'theme', label: 'التصميم والألوان', icon: Palette }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">إعدادات الموقع</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">إعدادات الموقع</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          خطأ في تحميل الإعدادات: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إعدادات الموقع الشاملة</h1>
          <p className="text-gray-600">تحكم في جميع نصوص وإعدادات الموقع</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Success/Error Messages */}
          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              تم حفظ الإعدادات بنجاح!
            </div>
          )}
          
          {saveError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {saveError}
            </div>
          )}

          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                الإعدادات العامة
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الموقع *
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شعار الموقع *
                  </label>
                  <input
                    type="text"
                    name="siteTagline"
                    value={formData.siteTagline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الموقع *
                </label>
                <textarea
                  name="siteDescription"
                  value={formData.siteDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">🗺️ إعداد الخريطة:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li><strong>1.</strong> اذهب إلى <a href="https://maps.google.com" target=\"_blank" class="underline">Google Maps</a></li>
                  <li><strong>2.</strong> ابحث عن موقع متجرك</li>
                  <li><strong>3.</strong> انقر بالزر الأيمن على الموقع</li>
                  <li><strong>4.</strong> انسخ الإحداثيات (الرقم الأول = خط العرض، الثاني = خط الطول)</li>
                  <li><strong>5.</strong> أدخل الإحداثيات في الحقول أدناه</li>
                </ol>
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-800">
                    <strong>✅ API Key مفعل:</strong> الخريطة ستعمل بكامل الميزات!
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Maps API Key
                </label>
                <input
                  type="text"
                  name="googleMapsApiKey"
                  value={formData.googleMapsApiKey}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="AIzaSy..."
                />
                <div className="mt-2">
                  <p className="text-xs text-gray-600">
                    مطلوب لعرض الخرائط بشكل صحيح. احصل عليه من Google Cloud Console.
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    API Key الحالي: AIzaSyDV0zNlb2O-blUSUJF6XgOmeJ-QeC2qeos
                  </p>
                </div>
                {formData.googleMapsApiKey && (
                  <div className="mt-2 text-xs text-green-600 bg-green-50 border border-green-200 rounded px-2 py-1">
                    ✓ API Key محفوظ ومفعل
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الخريطة
                </label>
                <select
                  name="mapType"
                  value={formData.mapType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="google">Google Maps</option>
                  <option value="openstreetmap">OpenStreetMap (مجاني)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الشعار
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الواتساب *
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ساعات العمل *
                </label>
                <input
                  type="text"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Hero Section Tab */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Settings2 className="w-5 h-5 mr-2" />
                إعدادات الصفحة الرئيسية
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان الرئيسي
                </label>
                <input
                  type="text"
                  name="heroTitle"
                  value={formData.heroTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان الفرعي
                </label>
                <input
                  type="text"
                  name="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الصفحة الرئيسية
                </label>
                <textarea
                  name="heroDescription"
                  value={formData.heroDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد المنتجات
                  </label>
                  <input
                    type="text"
                    name="statProductsCount"
                    value={formData.statProductsCount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="500+"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد العملاء
                  </label>
                  <input
                    type="text"
                    name="statCustomersCount"
                    value={formData.statCustomersCount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1000+"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    معدل الرضا
                  </label>
                  <input
                    type="text"
                    name="statSatisfactionRate"
                    value={formData.statSatisfactionRate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="99%"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    توفر الدعم
                  </label>
                  <input
                    type="text"
                    name="statSupportAvailability"
                    value={formData.statSupportAvailability}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="24/7"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Share2 className="w-5 h-5 mr-2" />
                وسائل التواصل الاجتماعي
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    فيسبوك
                  </label>
                  <input
                    type="url"
                    name="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تويتر
                  </label>
                  <input
                    type="url"
                    name="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إنستغرام
                  </label>
                  <input
                    type="url"
                    name="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    يوتيوب
                  </label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    لينكد إن
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تيك توك
                  </label>
                  <input
                    type="url"
                    name="tiktokUrl"
                    value={formData.tiktokUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://tiktok.com/@yourhandle"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                محتوى الأقسام
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان قسم "من نحن"
                  </label>
                  <input
                    type="text"
                    name="aboutTitle"
                    value={formData.aboutTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان قسم الخدمات
                  </label>
                  <input
                    type="text"
                    name="servicesTitle"
                    value={formData.servicesTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف قسم "من نحن"
                </label>
                <textarea
                  name="aboutDescription"
                  value={formData.aboutDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف قسم الخدمات
                </label>
                <textarea
                  name="servicesDescription"
                  value={formData.servicesDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان قسم التقييمات
                  </label>
                  <input
                    type="text"
                    name="testimonialsTitle"
                    value={formData.testimonialsTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان النشرة الإخبارية
                  </label>
                  <input
                    type="text"
                    name="newsletterTitle"
                    value={formData.newsletterTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف التقييمات
                </label>
                <textarea
                  name="testimonialsDescription"
                  value={formData.testimonialsDescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف النشرة الإخبارية
                </label>
                <textarea
                  name="newsletterDescription"
                  value={formData.newsletterDescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الفوتر
                </label>
                <textarea
                  name="footerDescription"
                  value={formData.footerDescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نص حقوق الطبع والنشر
                </label>
                <input
                  type="text"
                  name="copyrightText"
                  value={formData.copyrightText}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Business Tab */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                معلومات العمل
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    هاتف الطوارئ
                  </label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    بريد الدعم الفني
                  </label>
                  <input
                    type="email"
                    name="supportEmail"
                    value={formData.supportEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    بريد المبيعات
                  </label>
                  <input
                    type="email"
                    name="salesEmail"
                    value={formData.salesEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رخصة العمل
                  </label>
                  <input
                    type="text"
                    name="businessLicense"
                    value={formData.businessLicense}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الرقم الضريبي
                  </label>
                  <input
                    type="text"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الحساب البنكي
                  </label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رسوم التوصيل (د.ج)
                  </label>
                  <input
                    type="number"
                    name="deliveryFee"
                    value={formData.deliveryFee}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    حد التوصيل المجاني (د.ج)
                  </label>
                  <input
                    type="number"
                    name="freeDeliveryThreshold"
                    value={formData.freeDeliveryThreshold}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مناطق التوصيل
                </label>
                <input
                  type="text"
                  name="deliveryAreas"
                  value={formData.deliveryAreas}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="الجزائر، وهران، قسنطينة"
                />
              </div>
            </div>
          )}

          {/* Theme Tab */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                التصميم والألوان
                <p className="text-xs text-gray-500 mt-1">
                  رابط Google Maps للتضمين في الموقع
                </p>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    خط العرض (Latitude)
                  </label>
                  <input
                    type="number"
                    name="mapLatitude"
                    value={formData.mapLatitude}
                    onChange={handleChange}
                    step="0.000001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="36.7538"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    خط الطول (Longitude)
                  </label>
                  <input
                    type="number"
                    name="mapLongitude"
                    value={formData.mapLongitude}
                    onChange={handleChange}
                    step="0.000001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3.0588"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مستوى التكبير (Zoom)
                  </label>
                  <input
                    type="number"
                    name="mapZoom"
                    value={formData.mapZoom}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اللون الأساسي
                  </label>
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اللون الثانوي
                  </label>
                  <input
                    type="color"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    لون التمييز
                  </label>
                  <input
                    type="color"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleChange}
                    className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الكلمات المفتاحية (SEO)
                  </label>
                  <input
                    type="text"
                    name="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المؤلف (SEO)
                  </label>
                  <input
                    type="text"
                    name="metaAuthor"
                    value={formData.metaAuthor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSS مخصص
                </label>
                <textarea
                  name="customCss"
                  value={formData.customCss}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="/* أضف CSS مخصص هنا */"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JavaScript مخصص
                </label>
                <textarea
                  name="customJs"
                  value={formData.customJs}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="// أضف JavaScript مخصص هنا"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نص الإعلان
                </label>
                <input
                  type="text"
                  name="announcementText"
                  value={formData.announcementText}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="إعلان مهم للعملاء"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="announcementActive"
                  checked={formData.announcementActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  تفعيل الإعلان
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="enableDirections"
                  checked={formData.enableDirections}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  تفعيل الاتجاهات والملاحة
                </label>
              </div>

              {formData.mapLatitude && formData.mapLongitude && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">معاينة الموقع:</h4>
                  <p className="text-sm text-green-800">
                    الإحداثيات: {formData.mapLatitude}, {formData.mapLongitude}
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${formData.mapLatitude},${formData.mapLongitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    عرض في Google Maps
                  </a>
                </div>
              )}

              {/* Location Picker Tool */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">أداة تحديد الموقع</h4>
                <LocationPicker
                  latitude={formData.mapLatitude ? parseFloat(formData.mapLatitude) : undefined}
                  longitude={formData.mapLongitude ? parseFloat(formData.mapLongitude) : undefined}
                  apiKey={formData.googleMapsApiKey}
                  onLocationChange={(lat, lng) => {
                    setFormData(prev => ({
                      ...prev,
                      mapLatitude: lat.toString(),
                      mapLongitude: lng.toString()
                    }));
                  }}
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button
              type="submit"
              loading={saving}
              icon={Save}
              size="lg"
            >
              حفظ جميع الإعدادات
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}