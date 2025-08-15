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
          createdAt: data.created_at,
          updatedAt: data.updated_at
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
            hours: updates.hours || 'Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 12PM-5PM'
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
            hours: updates.hours
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