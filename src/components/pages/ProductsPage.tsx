import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, Filter, Grid, List, ArrowLeft } from 'lucide-react';
import { ProductCard } from '../ui/ProductCard';
import { Button } from '../ui/Button';
import { useProducts, useCategories } from '../../hooks/useSupabaseData';

export function ProductsPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  const currentCategory = categories.find(cat => cat.slug === category);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(product => product.category.slug === category);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'brand':
          return a.brand.localeCompare(b.brand);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, category, searchQuery, sortBy, priceRange]);

  const handleProductView = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link 
              to="/"
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              العودة إلى الرئيسية
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {currentCategory ? currentCategory.name : 'كل المنتجات'}
          </h1>
          <p className="text-gray-600 mt-2">
            {currentCategory ? currentCategory.description : 'اكتشف مجموعتنا الواسعة من المنتجات التقنية'}
          </p>
        </div>
        
        <div className="text-sm text-gray-500">
          {filteredProducts.length} منتج{filteredProducts.length !== 1 ? '' : ''}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن المنتجات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">الترتيب حسب الاسم</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
              <option value="brand">الترتيب حسب العلامة التجارية</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Price Range */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نطاق السعر: {priceRange[0].toLocaleString()} دج - {priceRange[1].toLocaleString()} دج
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="100000"
              step="100"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max="100000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: `${product.price.toLocaleString()} دج`
              }}
              onViewDetails={() => handleProductView(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-4">
            <Filter className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد منتجات</h3>
          <p className="text-gray-600 mb-6">
            جرّب تعديل معايير البحث أو تصفّح فئات مختلفة
          </p>
          <Button onClick={() => {
            setSearchQuery('');
            setPriceRange([0, 100000]);
          }}>
            إعادة تعيين الفلاتر
          </Button>
        </div>
      )}
    </div>
  );
}
