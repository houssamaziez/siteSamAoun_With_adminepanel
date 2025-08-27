import React from 'react';
import { 
  Package, Calendar, DollarSign, TrendingUp, Users, AlertCircle, 
  ShoppingCart, Star, Eye, Activity, BarChart3, PieChart 
} from 'lucide-react';
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
      change: `${products.filter(p => p.featured).length} featured`,
      changeType: 'neutral'
    },
    {
      name: 'Active Products',
      value: productsLoading ? '...' : products.filter(p => p.status === 'active').length.toString(),
      icon: Eye,
      color: 'bg-green-500',
      change: `${products.filter(p => p.status === 'inactive').length} inactive`,
      changeType: 'neutral'
    },
    {
      name: 'Low Stock Items',
      value: productsLoading ? '...' : products.filter(p => p.stock <= 5 && p.stock > 0).length.toString(),
      icon: AlertCircle,
      color: 'bg-orange-500',
      change: `${products.filter(p => p.stock === 0).length} out of stock`,
      changeType: 'negative'
    },
    {
      name: 'Total Reservations',
      value: reservationsLoading ? '...' : reservations.length.toString(),
      icon: Calendar,
      color: 'bg-purple-500',
      change: `${reservations.filter(r => r.status === 'pending').length} pending`,
      changeType: 'neutral'
    },
    {
      name: 'Confirmed Orders',
      value: reservationsLoading ? '...' : reservations.filter(r => r.status === 'confirmed').length.toString(),
      icon: ShoppingCart,
      color: 'bg-indigo-500',
      change: `${reservations.filter(r => r.status === 'completed').length} completed`,
      changeType: 'positive'
    },
    {
      name: 'Total Revenue',
      value: reservationsLoading ? '...' : `${reservations.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()} د.ج`,
      icon: DollarSign,
      color: 'bg-green-600',
      change: `${reservations.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()} د.ج pending`,
      changeType: 'positive'
    },
    {
      name: 'Average Order Value',
      value: reservationsLoading ? '...' : reservations.filter(r => r.status === 'pending').length.toString(),
      icon: TrendingUp,
      color: 'bg-teal-500',
      change: reservations.length > 0 ? `${Math.round(reservations.reduce((sum, r) => sum + r.totalAmount, 0) / reservations.length).toLocaleString()} د.ج avg` : '0 د.ج avg',
      changeType: 'positive'
    },
    {
      name: 'Top Category',
      value: productsLoading ? '...' : (() => {
        const categoryCount = {};
        products.forEach(p => {
          categoryCount[p.category.name] = (categoryCount[p.category.name] || 0) + 1;
        });
        const topCategory = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0];
        return topCategory ? topCategory[0] : 'None';
      })(),
      icon: BarChart3,
      color: 'bg-pink-500',
      change: productsLoading ? '...' : (() => {
        const categoryCount = {};
        products.forEach(p => {
          categoryCount[p.category.name] = (categoryCount[p.category.name] || 0) + 1;
        });
        const topCategory = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0];
        return topCategory ? `${topCategory[1]} products` : '0 products';
      })(),
      changeType: 'positive'
    }
  ];

  const recentReservations = reservations.slice(0, 5);
  const lowStockProducts = products.filter(p => p.stock <= 5).slice(0, 5);
  const topSellingProducts = products.filter(p => p.featured).slice(0, 5);

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
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                {lowStockProducts.map((product) => (
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

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Featured Products</h3>
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
                {topSellingProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.brand}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-600 text-sm">{product.price.toLocaleString()} د.ج</p>
                      <p className="text-xs text-gray-500">{product.stock} in stock</p>
                    </div>
                  </div>
                ))}
                {topSellingProducts.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No featured products</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors cursor-pointer">
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-blue-900">Add Product</p>
            <p className="text-sm text-blue-600">Create new product</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center hover:bg-green-100 transition-colors cursor-pointer">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-900">View Orders</p>
            <p className="text-sm text-green-600">Manage reservations</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center hover:bg-purple-100 transition-colors cursor-pointer">
            <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-purple-900">Analytics</p>
            <p className="text-sm text-purple-600">View reports</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center hover:bg-orange-100 transition-colors cursor-pointer">
            <AlertCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="font-medium text-orange-900">Stock Alert</p>
            <p className="text-sm text-orange-600">Check inventory</p>
          </div>
        </div>
      </div>
    </div>
  );
}