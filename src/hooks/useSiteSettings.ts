import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
    
    // Set up real-time subscription for settings changes
    const subscription = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'site_settings' },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        const formattedSettings: SiteSettings = {
          id: data.id,
          siteName: data.site_name,
          siteTagline: data.site_tagline,
          siteDescription: data.site_description,
          logoUrl: data.logo_url,
          address: data.address,
          phone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email,
          hours: data.hours,
          heroTitle: data.hero_title,
          heroSubtitle: data.hero_subtitle,
          heroDescription: data.hero_description,
          facebookUrl: data.facebook_url,
          twitterUrl: data.twitter_url,
          instagramUrl: data.instagram_url,
          youtubeUrl: data.youtube_url,
          linkedinUrl: data.linkedin_url,
          tiktokUrl: data.tiktok_url,
          aboutTitle: data.about_title,
          aboutDescription: data.about_description,
          servicesTitle: data.services_title,
          servicesDescription: data.services_description,
          contactTitle: data.contact_title,
          emergencyPhone: data.emergency_phone,
          supportEmail: data.support_email,
          salesEmail: data.sales_email,
          footerDescription: data.footer_description,
          copyrightText: data.copyright_text,
          metaKeywords: data.meta_keywords,
          metaAuthor: data.meta_author,
          primaryColor: data.primary_color,
          secondaryColor: data.secondary_color,
          accentColor: data.accent_color,
          customCss: data.custom_css,
          customJs: data.custom_js,
          announcementText: data.announcement_text,
          announcementActive: data.announcement_active,
          businessLicense: data.business_license,
          taxNumber: data.tax_number,
          bankAccount: data.bank_account,
          deliveryFee: data.delivery_fee,
          freeDeliveryThreshold: data.free_delivery_threshold,
          deliveryAreas: data.delivery_areas,
          testimonialsTitle: data.testimonials_title,
          testimonialsDescription: data.testimonials_description,
          newsletterTitle: data.newsletter_title,
          newsletterDescription: data.newsletter_description,
          statProductsCount: data.stat_products_count,
          statCustomersCount: data.stat_customers_count,
          statSatisfactionRate: data.stat_satisfaction_rate,
          statSupportAvailability: data.stat_support_availability,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          mapUrl: data.map_url,
          mapLatitude: data.map_latitude,
          mapLongitude: data.map_longitude,
          mapZoom: data.map_zoom,
          googleMapsApiKey: data.google_maps_api_key,
          mapType: data.map_type || 'google',
          enableDirections: data.enable_directions
        };
        setSettings(formattedSettings);
      }
    } catch (err) {
      console.error('Settings fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<Omit<SiteSettings, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      if (!settings?.id) {
        // If no settings exist, create them
        const { error } = await supabase
          .from('site_settings')
          .insert({
            site_name: updates.siteName || 'TechHub Pro',
            site_tagline: updates.siteTagline || 'Your Complete Technology Solution',
            site_description: updates.siteDescription || 'Professional computer and technology store',
            logo_url: updates.logoUrl,
            address: updates.address || '123 Tech Street, Digital City, DC 12345',
            phone: updates.phone || '+1 (555) 123-4567',
            whatsapp: updates.whatsapp || '+1 (555) 123-4567',
            email: updates.email || 'info@techhubpro.com',
            hours: updates.hours || 'Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 12PM-5PM',
            hero_title: updates.heroTitle,
            hero_subtitle: updates.heroSubtitle,
            hero_description: updates.heroDescription,
            facebook_url: updates.facebookUrl,
            twitter_url: updates.twitterUrl,
            instagram_url: updates.instagramUrl,
            youtube_url: updates.youtubeUrl,
            linkedin_url: updates.linkedinUrl,
            tiktok_url: updates.tiktokUrl,
            about_title: updates.aboutTitle,
            about_description: updates.aboutDescription,
            services_title: updates.servicesTitle,
            services_description: updates.servicesDescription,
            contact_title: updates.contactTitle,
            emergency_phone: updates.emergencyPhone,
            support_email: updates.supportEmail,
            sales_email: updates.salesEmail,
            footer_description: updates.footerDescription,
            copyright_text: updates.copyrightText,
            meta_keywords: updates.metaKeywords,
            meta_author: updates.metaAuthor,
            primary_color: updates.primaryColor,
            secondary_color: updates.secondaryColor,
            accent_color: updates.accentColor,
            custom_css: updates.customCss,
            custom_js: updates.customJs,
            announcement_text: updates.announcementText,
            announcement_active: updates.announcementActive,
            business_license: updates.businessLicense,
            tax_number: updates.taxNumber,
            bank_account: updates.bankAccount,
            delivery_fee: updates.deliveryFee,
            free_delivery_threshold: updates.freeDeliveryThreshold,
            delivery_areas: updates.deliveryAreas,
            testimonials_title: updates.testimonialsTitle,
            testimonials_description: updates.testimonialsDescription,
            newsletter_title: updates.newsletterTitle,
            newsletter_description: updates.newsletterDescription,
            stat_products_count: updates.statProductsCount,
            stat_customers_count: updates.statCustomersCount,
            stat_satisfaction_rate: updates.statSatisfactionRate,
            stat_support_availability: updates.statSupportAvailability,
            map_url: updates.mapUrl,
            map_latitude: updates.mapLatitude,
            map_longitude: updates.mapLongitude,
            map_zoom: updates.mapZoom,
            google_maps_api_key: updates.googleMapsApiKey,
            map_type: updates.mapType,
            enable_directions: updates.enableDirections
          });

        if (error) throw error;
      } else {
        // Update existing settings
        const { error } = await supabase
          .from('site_settings')
          .update({
            site_name: updates.siteName,
            site_tagline: updates.siteTagline,
            site_description: updates.siteDescription,
            logo_url: updates.logoUrl,
            address: updates.address,
            phone: updates.phone,
            whatsapp: updates.whatsapp,
            email: updates.email,
            hours: updates.hours,
            hero_title: updates.heroTitle,
            hero_subtitle: updates.heroSubtitle,
            hero_description: updates.heroDescription,
            facebook_url: updates.facebookUrl,
            twitter_url: updates.twitterUrl,
            instagram_url: updates.instagramUrl,
            youtube_url: updates.youtubeUrl,
            linkedin_url: updates.linkedinUrl,
            tiktok_url: updates.tiktokUrl,
            about_title: updates.aboutTitle,
            about_description: updates.aboutDescription,
            services_title: updates.servicesTitle,
            services_description: updates.servicesDescription,
            contact_title: updates.contactTitle,
            emergency_phone: updates.emergencyPhone,
            support_email: updates.supportEmail,
            sales_email: updates.salesEmail,
            footer_description: updates.footerDescription,
            copyright_text: updates.copyrightText,
            meta_keywords: updates.metaKeywords,
            meta_author: updates.metaAuthor,
            primary_color: updates.primaryColor,
            secondary_color: updates.secondaryColor,
            accent_color: updates.accentColor,
            custom_css: updates.customCss,
            custom_js: updates.customJs,
            announcement_text: updates.announcementText,
            announcement_active: updates.announcementActive,
            business_license: updates.businessLicense,
            tax_number: updates.taxNumber,
            bank_account: updates.bankAccount,
            delivery_fee: updates.deliveryFee,
            free_delivery_threshold: updates.freeDeliveryThreshold,
            delivery_areas: updates.deliveryAreas,
            testimonials_title: updates.testimonialsTitle,
            testimonials_description: updates.testimonialsDescription,
            newsletter_title: updates.newsletterTitle,
            newsletter_description: updates.newsletterDescription,
            stat_products_count: updates.statProductsCount,
            stat_customers_count: updates.statCustomersCount,
            stat_satisfaction_rate: updates.statSatisfactionRate,
            stat_support_availability: updates.statSupportAvailability,
            map_url: updates.mapUrl,
            map_latitude: updates.mapLatitude,
            map_longitude: updates.mapLongitude,
            map_zoom: updates.mapZoom,
            google_maps_api_key: updates.googleMapsApiKey,
            map_type: updates.mapType,
            enable_directions: updates.enableDirections
          })
          .eq('id', settings.id);

        if (error) throw error;
      }
      
      await fetchSettings(); // Refresh settings
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update settings' 
      };
    }
  };

  return { settings, loading, error, refetch: fetchSettings, updateSettings };
}