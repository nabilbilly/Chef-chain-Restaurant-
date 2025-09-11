import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Edit, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UpdateMenuItems() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Form state for editing
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true
  });

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/menu/');
      const data = response.data.results || response.data || [];
      setMenu(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setMenu([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/');
      const data = response.data.results || response.data || [];
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Start editing an item
  const startEdit = (item) => {
    setEditingItem(item.id);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category || '',
      available: item.available
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', category: '', available: true });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Update menu item
  // Update menu item
const updateItem = async () => {
  try {
    await api.patch(`/menu/${editingItem}/`, formData);

    setMenu(prevMenu =>
      prevMenu.map(item =>
        item.id === editingItem ? { ...item, ...formData } : item
      )
    );

    showToast('Menu item updated successfully!');
    cancelEdit();
  } catch (error) {
    console.error('Error updating item:', error);
    showToast('Error updating menu item', 'error');
  }
};

//   const updateItem = async () => {
//     try {
//       await api.patch(`/menu/${editingItem}/`, formData);
//       showToast('Menu item updated successfully!');
//       fetchMenuItems();
//       cancelEdit();
//     } catch (error) {
//       console.error('Error updating item:', error);
//       showToast('Error updating menu item', 'error');
//     }
//   };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'No Category';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50 p-6">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Update Menu Items</h1>
            <Link to="/kitchen" className="flex items-center p-2 text-orange-500 hover:orange-400 transition-colors">
                <button className="text-sm bg-orange-500 hover:bg-gray-200 text-white px-3 py-1 rounded-md transition-colors" >
                🍰 Back to Kitchen </button> 
            </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {menu.map((item) => (
                  <tr key={item.id}>
                    {editingItem === item.id ? (
                      <>
                        {/* Editing Mode */}
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            rows="2"
                            className="w-full mt-2 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            step="0.01"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">No Category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="available"
                              checked={formData.available}
                              onChange={handleInputChange}
                              className="mr-2"
                            />
                            <span className="text-sm">Available</span>
                          </label>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={updateItem}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                            >
                              <Save className="w-3 h-3" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* Display Mode */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <span>🍽️</span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-orange-600">
                          ₵{parseFloat(item.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {getCategoryName(item.category)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => startEdit(item)}
                            className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-400nflex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}