import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import ProductEditor from '../../components/admin/ProductEditor';

export default function AdminProducts() {
  const { db, deleteProduct, updateProduct } = useCms();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const products = db.products || [];

  // Derived categories for the filter dropdown
  const categories = ['All', ...new Set(products.map(p => p.mainCategory).filter(Boolean))];

  // Filtering logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.mainCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      await deleteProduct(id);
    }
  };

  const handleToggleStatus = async (product) => {
    // Cycle between Active -> Out of Stock -> Hidden -> Active
    const statuses = ['Active', 'Out of Stock', 'Hidden'];
    const currentIndex = statuses.indexOf(product.status || 'Active');
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    await updateProduct(product.id, { status: nextStatus });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Out of Stock': return 'bg-orange-100 text-orange-800';
      case 'Hidden': return 'bg-gray-100 text-gray-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#000000]">Products</h1>
          <p className="text-sm text-[#000000]/60 mt-2">Manage your inventory and catalog.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-[#000000] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#000000]/80 transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 border border-[#000000]/10 flex flex-col sm:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none"
        />
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-48 bg-[#f9f9f9] border border-[#000000]/20 px-4 py-2 text-sm focus:border-[#000000] outline-none"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-[#000000]/10 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#f9f9f9] border-b border-[#000000]/10 text-[10px] font-bold uppercase tracking-[0.1em] text-[#000000]/60">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#000000]/5">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-[#f9f9f9] transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4 min-w-[250px]">
                    <div className="w-12 h-12 bg-gray-100 flex-shrink-0">
                      {product.primaryImage ? (
                        <img src={product.primaryImage} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[#000000] truncate max-w-[200px]">{product.name}</p>
                      <p className="text-[#000000]/50 text-[10px] mt-0.5">{product.isNewArrival ? 'New Arrival' : ''}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#000000]/80">
                    {product.mainCategory}
                    {product.subCategory && <span className="text-[#000000]/40"> / {product.subCategory}</span>}
                  </td>
                  <td className="px-6 py-4 font-medium text-[#000000]">
                    Ksh {(product.salePrice || product.originalPrice || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-[#000000]/80">
                    <span className={product.stock < 5 ? 'text-red-600 font-bold' : ''}>{product.stock}</span> units
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleStatus(product)}
                      className={`text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-sm ${getStatusStyle(product.status || 'Active')}`}
                    >
                      {product.status || 'Active'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => handleEdit(product)} className="text-[10px] font-bold uppercase tracking-[0.1em] text-blue-600 hover:text-blue-800">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-[10px] font-bold uppercase tracking-[0.1em] text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-[#000000]/50">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditorOpen && (
        <ProductEditor 
          product={editingProduct} 
          onClose={() => setIsEditorOpen(false)} 
        />
      )}
    </div>
  );
}
