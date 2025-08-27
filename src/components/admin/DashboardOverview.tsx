import React from 'react';
import { Package, Calendar, DollarSign, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { useProducts, useReservations } from '../../hooks/useSupabaseData';

export function DashboardOverview() {
  const { products, loading: productsLoading } = useProducts();
  const { reservations, loading: reservationsLoading } = useReservations();

  const stats = [
    {
      name: 'Total Products',
      value: productsLoading ? '...' : products.length.toString(),
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Pending Reservations',
      value: reservationsLoading ? '...' : reservations.filter(r => r.status === 'pending').length.toString(),
      icon: Calendar,
      color: 'bg-yellow-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      name: 'Total Revenue',
      value: reservationsLoading ? '...' : `${reservations.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()} د.ج`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+18%',
      changeType: 'positive'
    },
    {
      name: 'Low Stock Items',
      value: productsLoading ? '...' : products.filter(p => p.stock <= 5).length.toString(),
      icon: AlertCircle,
      color: 'bg-red-500',
      change: '-2%',
      changeType: 'negative'
    }
  ];

  const recentReservations = reservations.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reservations</h3>
          </div>
          <div className="p-6">
            {reservationsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentReservations.length > 0 ? (
              <div className="space-y-4">
                {recentReservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{reservation.customerName}</p>
                      <p className="text-sm text-gray-600">
                        {reservation.referenceNumber} • {reservation.totalAmount.toLocaleString()} د.ج
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      reservation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No reservations yet</p>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
          </div>
          <div className="p-6">
            {productsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.filter(p => p.stock <= 5).slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sku}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.stock === 0 ? 'bg-red-100 text-red-800' :
                      product.stock <= 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.stock} left
                    </span>
                  </div>
                ))}
                {products.filter(p => p.stock <= 5).length === 0 && (
                  <p className="text-gray-500 text-center py-8">All products are well stocked</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}