import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Package, AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useProducts } from '../../hooks/useSupabaseData';
import { ProductForm } from './ProductForm';
import { supabase, getCurrentUser, isAdmin } from '../../lib/supabase';

export function ProductsManager() {
  const { products, loading, error, refetch } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check admin status on component mount
  React.useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { user } = await getCurrentUser();
      if (user) {
        const { isAdmin: adminStatus } = await isAdmin(user.id);
        setIsAdminUser(adminStatus);
      }
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setIsAdminUser(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category.slug === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleEditProduct = (product) => {
    if (!isAdminUser) {
      alert('You do not have permission to edit products. Please contact an administrator.');
      return;
    }
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleViewProduct = (product) => {
    setViewingProduct(product);
  };

  const handleDeleteProduct = async (productId) => {
    if (!isAdminUser) {
      alert('You do not have permission to delete products. Please contact an administrator.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      refetch();
      alert('Product deleted successfully!');
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading || checkingAuth) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error loading products: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
          {!isAdminUser && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg mt-2">
              <p className="text-sm">⚠️ You have read-only access. Contact an administrator to edit or delete products.</p>
            </div>
          )}
        </div>
        {isAdminUser && (
          <Button icon={Plus} onClick={() => setShowForm(true)}>
            Add Product
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="laptops">Laptops</option>
            <option value="desktops">Desktops</option>
            <option value="components">Components</option>
            <option value="peripherals">Peripherals</option>
            <option value="gaming">Gaming</option>
            <option value="networking">Networking</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Product</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">SKU</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Category</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Price</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Stock</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{product.sku}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{product.category.name}</td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{product.price.toLocaleString()} د.ج</p>
                      {product.originalPrice && (
                        <p className="text-gray-500 line-through">{product.originalPrice.toLocaleString()} د.ج</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.stock === 0 ? 'bg-red-100 text-red-800' :
                      product.stock <= 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' :
                      product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        onClick={() => handleViewProduct(product)}
                        title="View product details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {isAdminUser && (
                        <button 
                          className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                          onClick={() => handleEditProduct(product)}
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {isAdminUser && (
                        <button 
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {isAdminUser && (
        <ProductForm
          isOpen={showForm}
          onClose={handleCloseForm}
          onSuccess={() => {
            refetch();
            handleCloseForm();
          }}
          editingProduct={editingProduct}
        />
      )}

      {/* Product View Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setViewingProduct(null)} />
            
            <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
                <button onClick={() => setViewingProduct(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6 max-h-[600px] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={viewingProduct.images[0]}
                      alt={viewingProduct.name}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                    {viewingProduct.images.length > 1 && (
                      <div className="flex space-x-2 mt-3 overflow-x-auto">
                        {viewingProduct.images.slice(1, 4).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${viewingProduct.name} ${index + 2}`}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{viewingProduct.name}</h3>
                      <p className="text-lg text-blue-600 font-medium">{viewingProduct.brand}</p>
                    </div>
                    <div>
                      <span className="text-3xl font-bold text-blue-600">
                        {viewingProduct.price.toLocaleString()} د.ج
                      </span>
                      {viewingProduct.originalPrice && (
                        <span className="ml-2 text-lg text-gray-500 line-through">
                          {viewingProduct.originalPrice.toLocaleString()} د.ج
                        </span>
                      )}
                      {viewingProduct.originalPrice && (
                        <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                          {Math.round(((viewingProduct.originalPrice - viewingProduct.price) / viewingProduct.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-700">SKU:</span> 
                        <span className="ml-2 font-mono bg-gray-200 px-2 py-1 rounded text-xs">{viewingProduct.sku}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Stock:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                          viewingProduct.stock === 0 ? 'bg-red-100 text-red-800' :
                          viewingProduct.stock <= 5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {viewingProduct.stock} units
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Category:</span> 
                        <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{viewingProduct.category.name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span> 
                        <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                          viewingProduct.status === 'active' ? 'bg-green-100 text-green-800' :
                          viewingProduct.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {viewingProduct.status}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Condition:</span> 
                        <span className="ml-2 capitalize">{viewingProduct.condition}</span>
                      </div>
                      {viewingProduct.warranty && (
                        <div>
                          <span className="font-medium text-gray-700">Warranty:</span> 
                          <span className="ml-2">{viewingProduct.warranty}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-700">Featured:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded ${
                          viewingProduct.featured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {viewingProduct.featured ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    {viewingProduct.shortDescription && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Short Description</h4>
                        <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">{viewingProduct.shortDescription}</p>
                      </div>
                    )}
                    {viewingProduct.description && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-600 leading-relaxed">{viewingProduct.description}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {viewingProduct.specifications && Object.keys(viewingProduct.specifications).length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Specifications</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(viewingProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">{key}</span>
                            <span className="text-gray-900 font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Created: {new Date(viewingProduct.createdAt).toLocaleDateString()}
                    </div>
                    {isAdminUser && (
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => {
                            setViewingProduct(null);
                            handleEditProduct(viewingProduct);
                          }}
                          variant="outline"
                          size="sm"
                          icon={Edit}
                        >
                          Edit Product
                        </Button>
                        <Button
                          onClick={() => {
                            setViewingProduct(null);
                            handleDeleteProduct(viewingProduct.id);
                          }}
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}