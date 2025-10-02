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
            <h2 className="text-2xl font-semibold text-gray-900" dir="rtl">احجز منتجاتك</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* قسم معلومات العميل */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3" dir="rtl">معلومات العميل</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2" dir="rtl">
                    <User className="w-4 h-4 ml-2" /> الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل اسمك الكامل"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2" dir="rtl">
                    <Phone className="w-4 h-4 ml-2" /> رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="رقم هاتفك"
                  />
                </div>
              </div>
            </div>

            {/* قسم التواصل */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3" dir="rtl">تفاصيل التواصل</h3>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2" dir="rtl">
                <Phone className="w-4 h-4 ml-2" /> رقم الواتساب (اختياري)
              </label>
              <input
                type="tel"
                name="customerWhatsApp"
                value={formData.customerWhatsApp}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="رقم الواتساب (إذا كان مختلفاً)"
                dir="rtl"
              />
            </div>

            {/* قسم التاريخ والوقت */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3" dir="rtl">التاريخ والوقت المفضل</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2" dir="rtl">
                    <Calendar className="w-4 h-4 ml-2" /> التاريخ المفضل *
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
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2" dir="rtl">
                    <Clock className="w-4 h-4 ml-2" /> الوقت المفضل *
                  </label>
                  <select
                    name="proposedTime"
                    value={formData.proposedTime}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر الوقت</option>
                    {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* قسم الملاحظات */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3" dir="rtl">ملاحظات إضافية</h3>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2" dir="rtl">
                <MessageSquare className="w-4 h-4 ml-2" /> طلبات خاصة أو أسئلة
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أي متطلبات خاصة أو أسئلة..."
                dir="rtl"
              />
            </div>

            {/* الأزرار */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                إلغاء
              </Button>
              <Button type="submit" loading={loading} className="flex-1">
                إرسال الحجز
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
