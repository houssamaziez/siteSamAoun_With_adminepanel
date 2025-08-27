import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Navigation } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export function ContactPage() {
  const { settings } = useSiteSettings();
  
  const siteData = settings || {
    siteName: 'TechHub Pro',
    address: '123 Tech Street, Digital City, DC 12345',
    phone: '+1 (555) 123-4567',
    whatsapp: '+1 (555) 123-4567',
    email: 'info@techhubpro.com',
    hours: 'Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 12PM-5PM',
    mapUrl: 'https://maps.google.com/maps?q=36.7538,3.0588&z=15&output=embed'
  };

  const handleGetDirections = () => {
    if (settings?.mapLatitude && settings?.mapLongitude) {
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${settings.mapLatitude},${settings.mapLongitude}`;
      window.open(directionsUrl, '_blank');
    } else {
      // Fallback to general map view
      window.open('https://www.google.com/maps', '_blank');
    }
  };

  const handleFindUs = () => {
    if (settings?.mapLatitude && settings?.mapLongitude) {
      const mapUrl = `https://www.google.com/maps?q=${settings.mapLatitude},${settings.mapLongitude}&z=15`;
      window.open(mapUrl, '_blank');
    } else {
      window.open('https://www.google.com/maps', '_blank');
    }
  };

  // Generate proper Google Maps Embed URL
  const getEmbedMapUrl = () => {
    if (settings?.mapLatitude && settings?.mapLongitude) {
      if (settings?.googleMapsApiKey) {
        // Use Embed API with API key for better functionality
        return `https://www.google.com/maps/embed/v1/place?key=${settings.googleMapsApiKey}&q=${settings.mapLatitude},${settings.mapLongitude}&zoom=${settings.mapZoom || 15}`;
      } else {
        // Use basic embed URL without API key
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.398!2d${settings.mapLongitude}!3d${settings.mapLatitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s`;
      }
    } else {
      // Default fallback map (Algiers, Algeria)
      if (settings?.googleMapsApiKey) {
        return `https://www.google.com/maps/embed/v1/place?key=${settings.googleMapsApiKey}&q=Algiers,Algeria&zoom=12`;
      } else {
        return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.398!2d3.0588!3d36.7538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-6">
            {settings?.contactTitle || 'Contact Us'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team. We're here to help with all your technology needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 animate-fade-in-left">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-strong p-8 hover-lift">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center animate-float">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">{siteData.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center animate-float stagger-1">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">{siteData.phone}</p>
                    <p className="text-sm text-gray-500">WhatsApp: {siteData.whatsapp}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center animate-float stagger-2">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">{siteData.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center animate-float stagger-3">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">{siteData.hours}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={() => window.open(`https://wa.me/${siteData.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                  icon={MessageSquare}
                  className="w-full hover-lift btn-primary"
                >
                  Contact via WhatsApp
                </Button>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="animate-fade-in-right">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-strong overflow-hidden hover-lift">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Find Us</h2>
                <p className="text-gray-600">Visit our store for hands-on experience</p>
              </div>
              
              <div className="aspect-video">
                <iframe
                  src={getEmbedMapUrl()}
                  title="Store Location Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full rounded-lg"
                ></iframe>
              </div>
              
              <div className="p-6">
                <Button
                  onClick={handleFindUs}
                  icon={MapPin}
                  variant="outline"
                  className="w-full hover-lift mb-3"
                >
                  Open in Google Maps
                </Button>
                
                {settings?.enableDirections && (
                  <Button
                    onClick={handleGetDirections}
                    icon={Navigation}
                    className="w-full hover-lift"
                  >
                    Get Directions
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}