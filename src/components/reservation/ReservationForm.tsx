import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, MessageSquare, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Reservation } from '../../types';

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => void;
}

export function ReservationForm({ isOpen, onClose, onSubmit }: ReservationFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerWhatsApp: '',
    pickupBranch: 'Cortec batna',
    proposedDate: '',
    proposedTime: '',
    notes: ''
  });

  const branches = [
    { value: 'main-store', label: 'Main Store - Downtown' },
    { value: 'tech-plaza', label: 'Tech Plaza Branch' },
    { value: 'mall-location', label: 'Shopping Mall Location' }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM'
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'> = {
        referenceNumber: `RES-${Date.now()}`,
        ...formData,
        items: [], // هنا يمكنك تمرير عناصر السلة إذا أردت
        totalAmount: 0 // ضع هنا المجموع الكلي إذا أردت
      };
      await onSubmit(reservation);
      setFormData({
        customerName: '',
        customerPhone: '',
        customerWhatsApp: '',
        pickupBranch: 'main-store',
        proposedDate: '',
        proposedTime: '',
        notes: ''
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit reservation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* خلفية */}
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />

        {/* النموذج */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
          {/* رأس النموذج */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">Reserve Your Items</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* قسم معلومات العميل */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2" /> Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
            </div>

            {/* قسم التواصل */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Details</h3>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 mr-2" /> WhatsApp Number (Optional)
              </label>
              <input
                type="tel"
                name="customerWhatsApp"
                value={formData.customerWhatsApp}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="WhatsApp number (if different)"
              />
            </div>

            {/* قسم التاريخ والوقت */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Preferred Date & Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2" /> Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="proposedDate"
                    value={formData.proposedDate}
                    onChange={handleFormChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 mr-2" /> Preferred Time *
                  </label>
                  <select
                    name="proposedTime"
                    value={formData.proposedTime}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* قسم الملاحظات */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Notes</h3>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 mr-2" /> Special Requests or Questions
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special requirements or questions..."
              />
            </div>

            {/* الأزرار */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" loading={loading} className="flex-1">
                Submit Reservation
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
