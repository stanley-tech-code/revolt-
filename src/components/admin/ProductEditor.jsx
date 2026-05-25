import React, { useState, useRef } from 'react';
import { useCms } from '../../context/CmsContext';

export default function ProductEditor({ product, onClose }) {
  const { createProduct, updateProduct, uploadFile } = useCms();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const fileInputRef = useRef(null);

  // Define Category Hierarchy
  const CATEGORY_MAP = {
    'new-in': ['all-new-arrivals', 'back-in-stock', 'coming-soon', 'pre-order'],
    clothing: ['dresses', 'hoodies', 'sweatshirts', 'leggings', 'maternity', 'tops-bodysuits', 'pants', 'pajamas', 'shorts', 'skirts', 'tees-tanks'],
    bras: ['t-shirt-bras', 'strapless', 'full-coverage', 'maternity', 'lined', 'push-up', 'unlined', 'lightly-lined'],
    underwear: ['thongs', 'cheeky', 'maternity', 'seamless'],
    accessories: ['bags', 'glasses-shades', 'belts', 'perfumes'],
    swimwear: ['bikinis', 'swimsuits', 'swim-cover-ups']
  };

  // Build initial images array from existing product data
  const buildInitialImages = () => {
    if (product?.allImages && Array.isArray(product.allImages) && product.allImages.length > 0) {
      return product.allImages;
    }
    if (product?.primaryImage) {
      return [product.primaryImage];
    }
    return [];
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
    colors: product?.colors ? product.colors.join(', ') : '',
    sizes: product?.sizes ? product.sizes.join(', ') : ''
  });

  const [images, setImages] = useState(buildInitialImages()); // array of URL strings
  const [urlInput, setUrlInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      if (name === 'mainCategory') {
        newData.subCategory = CATEGORY_MAP[value]?.[0] || '';
      }
      return newData;
    });
  };

  // Upload one or multiple files
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (let i = 0; i < files.length; i++) {
      setUploadingIdx(images.length + i);
      const res = await uploadFile(files[i]);
      if (res.success) {
        setImages(prev => [...prev, res.url]);
      } else {
        setErrorMsg(res.error || 'Failed to upload one or more images.');
      }
    }
    setUploadingIdx(null);
    // Reset file input so same file can be re-selected
    e.target.value = '';
  };

  // Add image from URL input
  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setImages(prev => [...prev, trimmed]);
    setUrlInput('');
  };

  // Remove an image by index
  const handleRemoveImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Move image left (decrease index) — makes it "more primary"
  const handleMoveLeft = (idx) => {
    if (idx === 0) return;
    setImages(prev => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  // Move image right (increase index)
  const handleMoveRight = (idx) => {
    setImages(prev => {
      if (idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const payload = {
      ...formData,
      originalPrice: Number(formData.originalPrice),
      salePrice: Number(formData.salePrice),
      stock: Number(formData.stock),
      colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      allImages: images,             // full array stored in allImages column
      primaryImage: images[0] || '' // first image is always the primary
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

            {/* LEFT COLUMN: Basic Info & Images */}
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

              {/* ── MULTI-IMAGE SECTION ── */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-3">
                  Product Images
                  <span className="ml-2 text-[#000000]/40 normal-case font-normal">(first image = primary)</span>
                </label>

                {/* Image Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {images.map((url, idx) => (
                      <div key={idx} className="relative group border border-[#000000]/10 bg-[#f9f9f9] aspect-square overflow-hidden">
                        {/* Primary badge */}
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 z-10 bg-black text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5">
                            Primary
                          </span>
                        )}

                        <img src={url} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover" />

                        {/* Overlay controls */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveLeft(idx)}
                            disabled={idx === 0}
                            title="Move left"
                            className="bg-white/90 hover:bg-white text-black text-xs w-7 h-7 flex items-center justify-center disabled:opacity-30 transition-colors"
                          >
                            ←
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            title="Remove image"
                            className="bg-red-500 hover:bg-red-600 text-white text-xs w-7 h-7 flex items-center justify-center transition-colors"
                          >
                            ✕
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveRight(idx)}
                            disabled={idx === images.length - 1}
                            title="Move right"
                            className="bg-white/90 hover:bg-white text-black text-xs w-7 h-7 flex items-center justify-center disabled:opacity-30 transition-colors"
                          >
                            →
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Upload placeholder while uploading */}
                    {uploadingIdx !== null && (
                      <div className="border border-dashed border-[#000000]/20 bg-[#f9f9f9] aspect-square flex items-center justify-center">
                        <span className="text-[10px] text-[#000000]/40 animate-pulse">Uploading…</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-dashed border-[#000000]/30 bg-[#f9f9f9] hover:bg-[#f0f0f0] text-[10px] font-bold uppercase tracking-[0.15em] text-[#000000]/60 hover:text-[#000000] py-3 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="text-base leading-none">＋</span>
                    Upload Images
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* URL input row */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                      placeholder="Or paste an image URL…"
                      className="flex-1 bg-[#f9f9f9] border border-[#000000]/20 px-3 py-2 text-xs focus:border-[#000000] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="bg-[#000000] text-white text-[10px] font-bold uppercase tracking-[0.1em] px-4 py-2 hover:bg-[#000000]/80 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-[10px] text-[#000000]/40">
                    Hover over an image to reorder or remove it. First image will be shown as the primary thumbnail.
                  </p>
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
