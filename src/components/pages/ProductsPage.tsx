import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, Filter, Grid2x2 as Grid, List, ArrowLeft, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { ProductCard } from '../ui/ProductCard';
import { Button } from '../ui/Button';
import { useProducts, useCategories } from '../../hooks/useSupabaseData';

export function ProductsPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { categories } = useCategories();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<'all' | 'new' | 'refurbished'>('all');

  const currentCategory = categories.find(cat => cat.slug === category);

  // Get unique brands from products
  const availableBrands = useMemo(() => {
    const brands = [...new Set(products.map(product => product.brand))];
    return brands.sort();
  }, [products]);

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

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brand));
    }

    // Filter by condition
    if (selectedCondition !== 'all') {
      filtered = filtered.filter(product => product.condition === selectedCondition);
    }

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
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, category, searchQuery, sortBy, priceRange, selectedBrands, selectedCondition]);

  const handleProductView = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 100000]);
    setSelectedBrands([]);
    setSelectedCondition('all');
  };

  const activeFiltersCount = 
    (searchQuery ? 1 : 0) + 
    (selectedBrands.length > 0 ? 1 : 0) + 
    (selectedCondition !== 'all' ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {currentCategory ? currentCategory.name : 'All Products'}
            </span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2" dir="rtl">
                {currentCategory ? currentCategory.name : 'جميع المنتجات'}
              </h1>
              <p className="text-lg text-gray-600" dir="rtl">
                {currentCategory ? currentCategory.description : 'اكتشف مجموعتنا الكاملة من المنتجات التقنية'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border">
                <span className="font-medium text-gray-900">{filteredProducts.length}</span> منتج موجود
              </div>
              
              <Link 
                to="/"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                العودة للرئيسية
              </Link>
            </div>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن المنتجات، العلامات التجارية، أو الأوصاف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-right"
                  dir="rtl"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="name">ترتيب حسب الاسم</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="brand">ترتيب حسب العلامة التجارية</option>
                <option value="newest">الأحدث أولاً</option>
              </select>
            </div>

            {/* View Mode & Filters Toggle */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 rounded-lg border transition-all ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                الفلاتر
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3" dir="rtl">
                    نطاق السعر: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} د.ج
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3" dir="rtl">
                    العلامات التجارية ({selectedBrands.length} محددة)
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {availableBrands.map(brand => (
                      <label key={brand} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3" dir="rtl">
                    الحالة
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'جميع الحالات' },
                      { value: 'new', label: 'جديد' },
                      { value: 'refurbished', label: 'مُجدد' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="condition"
                          value={option.value}
                          checked={selectedCondition === option.value}
                          onChange={(e) => setSelectedCondition(e.target.value as any)}
                          className="border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    disabled={activeFiltersCount === 0}
                    className="w-full"
                  >
                    مسح جميع الفلاتر
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Tags */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 animate-fade-in">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700" dir="rtl">الفلاتر النشطة:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  البحث: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedBrands.map(brand => (
                <span key={brand} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  العلامة التجارية: {brand}
                  <button
                    onClick={() => handleBrandToggle(brand)}
                    className="ml-2 hover:text-green-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {selectedCondition !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  الحالة: {selectedCondition === 'new' ? 'جديد' : 'مُجدد'}
                  <button
                    onClick={() => setSelectedCondition('all')}
                    className="ml-2 hover:text-purple-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  السعر: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} د.ج
                  <button
                    onClick={() => setPriceRange([0, 100000])}
                    className="ml-2 hover:text-orange-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`animate-fade-in ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`animate-fade-in-up stagger-${(index % 4) + 1}`}
              >
                <ProductCard
                  product={product}
                  onViewDetails={() => handleProductView(product.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Filter className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4" dir="rtl">لم يتم العثور على منتجات</h3>
              <p className="text-gray-600 mb-8" dir="rtl">
                لم نتمكن من العثور على أي منتجات تطابق معاييرك. جرب تعديل الفلاتر أو مصطلحات البحث.
              </p>
              <div className="space-y-3">
                <Button onClick={clearFilters} className="w-full">
                  مسح جميع الفلاتر
                </Button>
                <Link to="/" className="block">
                  <Button variant="outline" className="w-full">
                    تصفح جميع الفئات
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Load More Button (if needed for pagination) */}
        {filteredProducts.length > 0 && filteredProducts.length >= 20 && (
          <div className="text-center mt-12 animate-fade-in">
            <Button variant="outline" size="lg">
              تحميل المزيد من المنتجات
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}