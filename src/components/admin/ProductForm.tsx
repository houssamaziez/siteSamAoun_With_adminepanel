import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useCategories } from '../../hooks/useSupabaseData';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingProduct?: any;
}

export function ProductForm({ isOpen, onClose, onSuccess, editingProduct }: ProductFormProps) {
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    slug: '',
    brand: '',
    price: '',
    originalPrice: '',
    currency: 'DZD',
    images: [''],
    categoryId: '',
    shortDescription: '',
    description: '',
    stock: '0',
    status: 'active' as 'active' | 'inactive' | 'out_of_stock',
    featured: false,
    warranty: '',
    condition: 'new' as 'new' | 'refurbished'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form data when editing product changes
  React.useEffect(() => {
    if (editingProduct) {
      console.log('Setting form data for editing product:', editingProduct);
      setFormData({
        sku: editingProduct.sku || '',
        name: editingProduct.name || '',
        slug: editingProduct.slug || '',
        brand: editingProduct.brand || '',
        price: editingProduct.price?.toString() || '',
        originalPrice: editingProduct.originalPrice?.toString() || '',
        currency: editingProduct.currency || 'DZD',
        images: Array.isArray(editingProduct.images) && editingProduct.images.length > 0 ? editingProduct.images : [''],
        categoryId: editingProduct.category_id || editingProduct.category?.id || '',
        shortDescription: editingProduct.shortDescription || '',
        description: editingProduct.description || '',
        stock: editingProduct.stock?.toString() || '0',
        status: editingProduct.status || 'active',
        featured: editingProduct.featured || false,
        warranty: editingProduct.warranty || '',
        condition: editingProduct.condition || 'new'
      });
      console.log('Form data set to:', formData);
    } else {
      // Reset form for new product
      console.log('Resetting form for new product');
      setFormData({
        sku: '',
        name: '',
        slug: '',
        brand: '',
        price: '',
        originalPrice: '',
        currency: 'DZD',
        images: [''],
        categoryId: '',
        shortDescription: '',
        description: '',
        stock: '0',
        status: 'active',
        featured: false,
        warranty: '',
        condition: 'new'
      });
    }
  }, [editingProduct, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const productData = {
        sku: formData.sku,
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        brand: formData.brand,
        price: parseFloat(formData.price),
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        currency: formData.currency,
        images: formData.images.filter(img => img.trim() !== ''),
        category_id: formData.categoryId,
        short_description: formData.shortDescription,
        description: formData.description,
        stock: parseInt(formData.stock),
        status: formData.status,
        featured: formData.featured,
        warranty: formData.warranty,
        condition: formData.condition
      };

      console.log('Updating product with data:', productData);
      console.log('Product ID:', editingProduct?.id);

      if (editingProduct) {
        // Update existing product
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
          .select();
        
        console.log('Update result:', { data, error });
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          throw new Error('Product update failed - no rows affected');
        }
        
        console.log('Product updated successfully:', data[0]);
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select();
        
        console.log('Insert result:', { data, error });
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        console.log('Product created successfully:', data[0]);
      }

      // Force a small delay to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Form submission error:', err);
      
      // Handle specific Supabase errors
      if (err instanceof Error) {
        if (err.message.includes('duplicate key value violates unique constraint "products_sku_key"')) {
          setError('This SKU already exists. Please use a unique SKU for this product.');
        } else if (err.message.includes('Product update failed - no rows affected')) {
          setError('Product update failed. The product may have been deleted or you may not have permission to update it.');
        } else {
          setError(err.message);
        }
      } else {
        setError(`Failed to ${editingProduct ? 'update' : 'create'} product`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Auto-generate slug from name
      if (name === 'name') {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        }));
      }
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages.length > 0 ? newImages : [''] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="PROD001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Apple, Dell, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="MacBook Pro 14-inch"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="999.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1199.99"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add another image
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief product description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed product description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="new">New</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warranty
              </label>
              <input
                type="text"
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1 Year Manufacturer Warranty"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Featured Product
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="flex-1"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}