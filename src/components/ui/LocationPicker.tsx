import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, Target } from 'lucide-react';
import { Button } from './Button';

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
  apiKey?: string;
}

export function LocationPicker({ latitude, longitude, onLocationChange, apiKey }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Use Google Geocoding API if API key is available
      if (apiKey) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${apiKey}`
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          onLocationChange(location.lat, location.lng);
          setSearchQuery(''); // Clear search after successful result
        } else {
          setError('الموقع غير موجود. جرب مصطلح بحث مختلف.');
        }
      } else {
        // Fallback to Nominatim (OpenStreetMap) - free but limited
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          onLocationChange(parseFloat(data[0].lat), parseFloat(data[0].lon));
          setSearchQuery(''); // Clear search after successful result
        } else {
          setError('الموقع غير موجود. جرب مصطلح بحث مختلف.');
        }
      }
    } catch (err) {
      setError('خطأ في البحث عن الموقع. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('الموقع الجغرافي غير مدعوم في هذا المتصفح');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange(position.coords.latitude, position.coords.longitude);
        setIsLoading(false);
      },
      (err) => {
        setError('فشل في الحصول على الموقع الحالي');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          أدوات تحديد الموقع
        </h4>
        
        {/* Search Location */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن عنوان أو مكان..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            type="button"
            onClick={handleSearch}
            loading={isLoading}
            icon={Search}
            size="sm"
          >
            بحث
          </Button>
        </div>

        {/* Get Current Location */}
        <Button
          type="button"
          onClick={handleGetCurrentLocation}
          loading={isLoading}
          icon={Target}
          variant="outline"
          size="sm"
          className="w-full"
        >
          استخدام موقعي الحالي
        </Button>

        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}
      </div>

      {/* Current Location Display */}
      {latitude && longitude && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2 flex items-center">
            <Navigation className="w-4 h-4 mr-2" />
            الموقع المحدد
          </h4>
          <p className="text-sm text-green-800 mb-2">
            خط العرض: {latitude.toFixed(6)}
          </p>
          <p className="text-sm text-green-800 mb-3">
            خط الطول: {longitude.toFixed(6)}
          </p>
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            عرض في Google Maps
          </a>
        </div>
      )}
    </div>
  );
}