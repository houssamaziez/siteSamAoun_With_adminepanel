import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from '../ui/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4" dir="rtl">الصفحة غير موجودة</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto" dir="rtl">
            عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
            ربما تم نقلها أو حذفها أو أدخلت رابطاً خاطئاً.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button icon={Home} size="lg">
              العودة للرئيسية
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" icon={Search} size="lg">
              تصفح المنتجات
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p dir="rtl">تحتاج مساعدة؟ تواصل مع فريق الدعم</p>
        </div>
      </div>
    </div>
  );
}