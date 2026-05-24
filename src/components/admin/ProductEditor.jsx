import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';

export default function ProductEditor({ product, onClose }) {
  const { createProduct, updateProduct, uploadFile } = useCms();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Define Category Hierarchy
  const CATEGORY_MAP = {
    'new-in': ['all-new-arrivals', 'back-in-stock', 'coming-soon', 'pre-order'],
    clothing: ['dresses', 'hoodies', 'sweatshirts', 'leggings', 'maternity', 'tops-bodysuits', 'pants', 'pajamas', 'shorts', 'skirts', 'tees-tanks'],
    bras: ['t-shirt-bras', 'strapless', 'full-coverage', 'maternity', 'lined', 'push-up', 'unlined', 'lightly-lined'],
    underwear: ['thongs', 'cheeky', 'maternity', 'seamless'],
    accessories: ['bags', 'glasses-shades', 'belts', 'perfumes'],
    swimwear: ['bikinis', 'swimsuits', 'swim-cover-ups']
  };

  // Form State
  const [formData, setFormData] = useState({
    name: product?.name || '',
    mainCategory: product?.mainCategory || 'clothing',
    subCategory: product?.subCategory || '',
    originalPrice: product?.originalPrice || 0,
    salePrice: product?.salePrice || 0,
    stock: product?.stock || 0,
    status: product?.status || 'Active',
    description: product?.description || '',
    material: product?.material || '',
    isNewArrival: product?.isNewArrival || false,
    isBestSeller: product?.isBestSeller || false,
    primaryImage: product?.primaryImage || '',
    colors: product?.colors ? product.colors.join(', ') : '',
    sizes: product?.sizes ? product.sizes.join(', ') : ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      // If main category changes, reset the sub category to the first available option
      if (name === 'mainCategory') {
        newData.subCategory = CATEGORY_MAP[value]?.[0] || '';
      }
      
      return newData;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const res = await uploadFile(file);
    if (res.success) {
      setFormData(prev => ({ ...prev, primaryImage: res.url }));
    } else {
      setErrorMsg(res.error || 'Failed to upload image.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    // Prepare data
    const payload = {
      ...formData,
      originalPrice: Number(formData.originalPrice),
      salePrice: Number(formData.salePrice),
      stock: Number(formData.stock),
      colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean)
    };

    let success = false;
    if (product) {
      success = await updateProduct(product.id, payload);
    } else {
      success = await createProduct(payload);
    }

    setIsSubmitting(false);
    if (success) {
      onClose();
    } else {
      setErrorMsg('An error occurred while saving the product.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:p-8 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl h-full md:h-auto max-h-full flex flex-col shadow-2xl">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-[#000000]/10">
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#000000]">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-[#000000]/60 hover:text-[#000000] text-2xl leading-none">&times;</button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-semibold uppercase tracking-wider border border-red-200">
              {errorMsg}
            </div>
          )}

          <form id="productForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LEFT COLUMN: Basic Info & Image */}
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2">Product Name <span className="text-red-500">*</span></label>
                <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] outline-none" placeholder="e.g. The Signature Hoodie" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2">Original Price <span className="text-red-500">*</span></label>
                  <input required name="originalPrice" value={formData.originalPrice} onChange={handleChange} type="number" min="0" step="0.01" className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2">Sale Price</label>
                  <input name="salePrice" value={formData.salePrice} onChange={handleChange} type="number" min="0" step="0.01" className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2">Primary Image</label>
                <div className="flex gap-4 items-end">
                  <div className="w-24 h-24 bg-gray-100 border border-[#000000]/20 shrink-0">
                    {formData.primaryImage ? (
                      <img src={formData.primaryImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#000000]/30 text-xs">No Img</div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input name="primaryImage" value={formData.primaryImage} onChange={handleChange} type="text" placeholder="Image URL (or upload below)" className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] outline-none resize-none"></textarea>
              </div>
            </div>

            {/* RIGHT COLUMN: Categorization & Variants */}
            <div className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2">Stock Level <span className="text-red-500">*</span></label>
                  <input required name="stock" value={formData.stock} onChange={handleChange} type="number" min="0" className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] outline-none">
                    <option value="Active">Active (Visible)</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2">Main Category</label>
                  <select name="mainCategory" value={formData.mainCategory} onChange={handleChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] outline-none capitalize">
                    {Object.keys(CATEGORY_MAP).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2">Sub Category</label>
                  <select name="subCategory" value={formData.subCategory} onChange={handleChange} className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] outline-none capitalize">
                    {CATEGORY_MAP[formData.mainCategory]?.map(sub => (
                      <option key={sub} value={sub}>{sub.replace('-', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2">Sizes (Comma separated)</label>
                <input name="sizes" value={formData.sizes} onChange={handleChange} type="text" placeholder="e.g. XS, S, M, L, XL" className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2">Colors (Comma separated)</label>
                <input name="colors" value={formData.colors} onChange={handleChange} type="text" placeholder="e.g. Onyx Black, Slate Gray" className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2">Material</label>
                <input name="material" value={formData.material} onChange={handleChange} type="text" placeholder="e.g. 100% Heavyweight Cotton" className="w-full bg-[#f9f9f9] border border-[#000000]/20 px-4 py-3 text-sm focus:border-[#000000] outline-none" />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} type="checkbox" className="w-4 h-4 accent-[#000000]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#000000]">Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} type="checkbox" className="w-4 h-4 accent-[#000000]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#000000]">New Arrival</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-[#000000]/10 flex justify-end gap-4 bg-[#f9f9f9]">
          <button onClick={onClose} type="button" className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000] hover:text-[#000000]/60 transition-colors">
            Cancel
          </button>
          <button form="productForm" type="submit" disabled={isSubmitting} className="bg-[#000000] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#000000]/80 transition-colors disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>

      </div>
    </div>
  );
}
