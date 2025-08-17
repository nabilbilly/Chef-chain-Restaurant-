// import { useState, useEffect } from 'react';
// import { Search, Menu, Calendar, Clock, Circle, Edit, Minus, Plus, Check } from 'lucide-react';

// // Mock API service to simulate your backend
// const mockApi = {
//   get: async (endpoint) => {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 100));
    
//     if (endpoint === "/categories/") {
//       return {
//         data: {
//           results: [
//             { id: 1, name: 'Breads', description: 'Fresh baked breads', icon: '🍞' },
//             { id: 2, name: 'Cakes', description: 'Delicious cakes', icon: '🍰' },
//             { id: 3, name: 'Donuts', description: 'Sweet donuts', icon: '🍩' },
//             { id: 4, name: 'Pastries', description: 'Flaky pastries', icon: '🥐' },
//             { id: 5, name: 'Sandwich', description: 'Fresh sandwiches', icon: '🥪' }
//           ]
//         }
//       };
//     }
    
//     if (endpoint === "/menu/" || endpoint.startsWith("/menu/?category=")) {
//       const mockItems = [
//         { id: 1, name: 'Beef Crowich', price: '5.50', category_name: 'Sandwich', category: 5 },
//         { id: 2, name: 'Buttermilk Croissant', price: '4.00', category_name: 'Pastries', category: 4 },
//         { id: 3, name: 'Cereal Cream Donut', price: '2.45', category_name: 'Donuts', category: 3 },
//         { id: 4, name: 'Cheesy Cheesecake', price: '3.75', category_name: 'Cakes', category: 2 },
//         { id: 5, name: 'Cheezy Sourdough', price: '4.50', category_name: 'Breads', category: 1 },
//         { id: 6, name: 'Egg Tart', price: '3.25', category_name: 'Pastries', category: 4 },
//         { id: 7, name: 'Grains Pan Bread', price: '4.50', category_name: 'Breads', category: 1 },
//         { id: 8, name: 'Spinchoco Roll', price: '4.00', category_name: 'Pastries', category: 4 }
//       ];
      
//       if (endpoint.includes("category=")) {
//         const categoryId = parseInt(endpoint.split("category=")[1]);
//         const filteredItems = mockItems.filter(item => item.category === categoryId);
//         return { data: { results: filteredItems } };
//       }
      
//       return { data: { results: mockItems } };
//     }
    
//     if (endpoint.includes("/menu/?search=")) {
//       const searchTerm = endpoint.split("search=")[1].toLowerCase();
//       const mockItems = [
//         { id: 1, name: 'Beef Crowich', price: '5.50', category_name: 'Sandwich', category: 5 },
//         { id: 2, name: 'Buttermilk Croissant', price: '4.00', category_name: 'Pastries', category: 4 },
//         { id: 3, name: 'Cereal Cream Donut', price: '2.45', category_name: 'Donuts', category: 3 },
//         { id: 4, name: 'Cheesy Cheesecake', price: '3.75', category_name: 'Cakes', category: 2 },
//         { id: 5, name: 'Cheezy Sourdough', price: '4.50', category_name: 'Breads', category: 1 },
//         { id: 6, name: 'Egg Tart', price: '3.25', category_name: 'Pastries', category: 4 },
//         { id: 7, name: 'Grains Pan Bread', price: '4.50', category_name: 'Breads', category: 1 },
//         { id: 8, name: 'Spinchoco Roll', price: '4.00', category_name: 'Pastries', category: 4 }
//       ];
      
//       const searchResults = mockItems.filter(item => 
//         item.name.toLowerCase().includes(searchTerm) || 
//         item.category_name.toLowerCase().includes(searchTerm)
//       );
      
//       return { data: { results: searchResults } };
//     }
    
//     return { data: { results: [] } };
//   }
// };

// export default function RestaurantOrdering() {
//   // API Integration State
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [menuItems, setMenuItems] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
  
//   // UI State
//   const [selectedTable, setSelectedTable] = useState('Table 05');
//   const [orderType, setOrderType] = useState('Dine In');
  
//   const [orderItems, setOrderItems] = useState([]);

//   // Fetch categories on component mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await mockApi.get("/categories/");
//         const categoriesData = res.data.results || res.data;
        
//         // Add "All Menu" as first category
//         const allMenuCategory = {
//           id: 'all',
//           name: 'All Menu',
//           description: 'All items',
//           icon: '📋'
//         };
        
//         // Add default icons to categories
//         const categoriesWithIcons = categoriesData.map(cat => ({
//           ...cat,
//           icon: getCategoryIcon(cat.name)
//         }));
        
//         setCategories([allMenuCategory, ...categoriesWithIcons]);
//         setSelectedCategory(allMenuCategory);
//       } catch (err) {
//         console.error("Error fetching categories", err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch all menu items when "All Menu" is selected or fetch by category
//   useEffect(() => {
//     if (selectedCategory) {
//       const fetchItems = async () => {
//         try {
//           let res;
//           if (selectedCategory.id === 'all') {
//             res = await mockApi.get("/menu/");
//           } else {
//             res = await mockApi.get(`/menu/?category=${selectedCategory.id}`);
//           }
          
//           const items = res.data.results || res.data;
//           setMenuItems(items);
//           setSearchResults([]); // Clear search results when category changes
//         } catch (err) {
//           console.error("Error fetching items", err);
//         }
//       };
//       fetchItems();
//     }
//   }, [selectedCategory]);

//   // Handle search
//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (searchQuery.trim() === "") {
//       setSearchResults([]);
//       return;
//     }
    
//     try {
//       const res = await mockApi.get(`/menu/?search=${searchQuery}`);
//       const results = res.data.results || res.data;
//       setSearchResults(results);
//     } catch (err) {
//       console.error("Error searching items", err);
//     }
//   };

//   // Handle real-time search
//   const handleSearchInput = (value) => {
//     setSearchQuery(value);
//     if (value.trim() === "") {
//       setSearchResults([]);
//     }
//   };

//   // Get category icon based on name
//   const getCategoryIcon = (name) => {
//     const iconMap = {
//       'Breads': '🍞',
//       'Bread': '🍞',
//       'Cakes': '🍰',
//       'Cake': '🍰',
//       'Donuts': '🍩',
//       'Donut': '🍩',
//       'Pastries': '🥐',
//       'Pastry': '🥐',
//       'Sandwich': '🥪',
//       'Sandwiches': '🥪'
//     };
//     return iconMap[name] || '🍽️';
//   };

//   // Get food emoji based on category or name
//   const getFoodEmoji = (item) => {
//     const category = item.category_name || item.category || '';
//     const name = item.name || '';
    
//     if (category.toLowerCase().includes('bread')) return '🍞';
//     if (category.toLowerCase().includes('cake')) return '🍰';
//     if (category.toLowerCase().includes('donut')) return '🍩';
//     if (category.toLowerCase().includes('pastry')) return '🥐';
//     if (category.toLowerCase().includes('sandwich')) return '🥪';
//     if (name.toLowerCase().includes('croissant')) return '🥐';
//     if (name.toLowerCase().includes('tart')) return '🥧';
//     if (name.toLowerCase().includes('roll')) return '🥖';
//     if (name.toLowerCase().includes('cheese')) return '🧀';
    
//     return '🍽️';
//   };

//   // Add item to order
//   const addToOrder = (item) => {
//     setOrderItems(currentItems => {
//       const existingItem = currentItems.find(orderItem => orderItem.id === item.id);
      
//       if (existingItem) {
//         return currentItems.map(orderItem =>
//           orderItem.id === item.id
//             ? { ...orderItem, quantity: orderItem.quantity + 1 }
//             : orderItem
//         );
//       } else {
//         return [...currentItems, {
//           id: item.id,
//           name: item.name,
//           price: parseFloat(item.price),
//           quantity: 1,
//           image: getFoodEmoji(item)
//         }];
//       }
//     });
//   };

//   // Update quantity in order
//   const updateQuantity = (id, change) => {
//     setOrderItems(items => 
//       items.map(item => 
//         item.id === id 
//           ? { ...item, quantity: Math.max(0, item.quantity + change) }
//           : item
//       ).filter(item => item.quantity > 0)
//     );
//   };

//   // Mock track orders data
//   const trackOrders = [
//     { name: 'Mike', table: 'Table 04', status: 'Dine in', time: '10:00 AM', statusColor: 'text-orange-500' },
//     { name: 'Billie', table: 'Table 03', status: 'Take Away', time: '08:43 AM', statusColor: 'text-green-500' },
//     { name: 'Richard', table: 'Table 02', status: 'Dine in', time: '08:15 AM', statusColor: 'text-blue-500' },
//     { name: 'Sharon', table: 'Table 01', status: 'To be Served', time: '', statusColor: 'text-purple-500' }
//   ];

//   // Calculate totals
//   const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const tax = subtotal * 0.05;
//   const discount = 1.00;
//   const total = subtotal + tax - discount;

//   // Determine which items to display
//   const itemsToDisplay = searchResults.length > 0 ? searchResults : menuItems;

//   return (
//     <div className="flex h-screen w-screen bg-gray-50">
//       {/* Left Sidebar */}
//       <div className="w-screen bg-white p-6 border-r border-gray-200">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <Menu className="w-6 h-6 text-gray-600" />
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <Calendar className="w-4 h-4" />
//               <span>Wed, 29 May 2024</span>
//               <span>—</span>
//               <Clock className="w-4 h-4" />
//               <span>07:59 AM</span>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Circle className="w-3 h-3 fill-green-500 text-green-500" />
//             <span className="text-sm text-green-600">Open Order</span>
//           </div>
//         </div>

//         {/* Categories */}
//         <div className="grid grid-cols-3 gap-3 mb-6">
//           {categories.map((category) => (
//             <button
//               key={category.id}
//               onClick={() => setSelectedCategory(category)}
//               className={`p-3 rounded-xl border text-center transition-all ${
//                 selectedCategory?.id === category.id
//                   ? 'bg-blue-500 text-white border-blue-500'
//                   : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
//               }`}
//             >
//               <div className="text-2xl mb-2">{category.icon}</div>
//               <div className="text-xs font-medium">{category.name}</div>
//               <div className="text-xs opacity-70">
//                 {category.id === 'all' ? `${menuItems.length} Items` : 'Items'}
//               </div>
//             </button>
//           ))}
//         </div>

//         {/* Search */}
//         <div className="relative mb-6">
//           <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//           <form onSubmit={handleSearch}>
//             <input
//               type="text"
//               placeholder="Search something sweet on your mind..."
//               value={searchQuery}
//               onChange={(e) => handleSearchInput(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//             />
//           </form>
//         </div>

//         {/* Menu Grid */}
//         <div className="grid grid-cols-2 gap-4 mb-6 max-h-96 overflow-y-auto">
//           {itemsToDisplay.length > 0 ? (
//             itemsToDisplay.map((item) => (
//               <div 
//                 key={item.id} 
//                 onClick={() => addToOrder(item)}
//                 className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
//               >
//                 <div className="text-4xl mb-3 text-center">{getFoodEmoji(item)}</div>
//                 <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded">
//                     {item.category_name || selectedCategory?.name || 'Item'}
//                   </span>
//                   <span className="font-semibold text-gray-800">${parseFloat(item.price).toFixed(2)}</span>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-2 text-center text-gray-500 py-8">
//               {searchQuery ? 'No items found for your search' : 'No items available'}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right Order Panel */}
//       <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
//         {/* Order Header */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h2 className="text-xl font-bold text-gray-800">Eloise's Order</h2>
//               <p className="text-sm text-gray-500">Order Number: #005</p>
//             </div>
//             <Edit className="w-5 h-5 text-gray-400" />
//           </div>
          
//           <div className="flex gap-4">
//             <select 
//               value={selectedTable}
//               onChange={(e) => setSelectedTable(e.target.value)}
//               className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//             >
//               <option>Table 05</option>
//               <option>Table 01</option>
//               <option>Table 02</option>
//               <option>Table 03</option>
//               <option>Table 04</option>
//             </select>
//             <select 
//               value={orderType}
//               onChange={(e) => setOrderType(e.target.value)}
//               className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//             >
//               <option>Dine In</option>
//               <option>Take Away</option>
//               <option>Delivery</option>
//             </select>
//           </div>
//         </div>

//         {/* Order Items */}
//         <div className="flex-1 p-6 overflow-y-auto">
//           {orderItems.length > 0 ? (
//             <>
//               <div className="space-y-4 mb-6">
//                 {orderItems.map((item) => (
//                   <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
//                     <div className="text-2xl">{item.image}</div>
//                     <div className="flex-1">
//                       <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
//                       <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => updateQuantity(item.id, -1)}
//                         className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
//                       >
//                         <Minus className="w-4 h-4 text-gray-600" />
//                       </button>
//                       <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
//                       <button
//                         onClick={() => updateQuantity(item.id, 1)}
//                         className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
//                       >
//                         <Plus className="w-4 h-4 text-gray-600" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Order Summary */}
//               <div className="space-y-3 mb-6">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span className="font-medium">${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Tax (5%)</span>
//                   <span className="font-medium">${tax.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Discount</span>
//                   <span className="font-medium text-red-500">-${discount.toFixed(2)}</span>
//                 </div>
//                 <div className="border-t border-gray-200 pt-3">
//                   <div className="flex justify-between">
//                     <span className="font-semibold text-gray-800">TOTAL</span>
//                     <span className="font-bold text-xl">${total.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="text-center text-gray-500 py-8">
//               <div className="text-4xl mb-4">🍽️</div>
//               <p>No items in order yet</p>
//               <p className="text-sm">Click on menu items to add them</p>
//             </div>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="p-6 border-t border-gray-200 space-y-3">
//           <div className="flex gap-3">
//             <button className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
//               <Check className="w-4 h-4" />
//               Promo Applied
//             </button>
//             <button className="flex-1 bg-gray-100 text-gray-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
//               QRIS
//             </button>
//           </div>
//           <button 
//             className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
//               orderItems.length > 0
//                 ? 'bg-blue-500 text-white hover:bg-blue-600'
//                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//             }`}
//             disabled={orderItems.length === 0}
//           >
//             Place Order
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }






import React, { useState, useEffect } from "react";
import api from "../services/api"; // your axios instance

export default function Ordering() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/");
        setCategories(res.data.results);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch items when category changes
useEffect(() => {
  if (selectedCategory) {
    const fetchItems = async () => {
      try {
        const res = await api.get(`/menu/?category=${selectedCategory.id}`);
        // 🔑 Handle both paginated & non-paginated
        setMenuItems(res.data.results ? res.data.results : res.data);
      } catch (err) {
        console.error("Error fetching items", err);
      }
    };
    fetchItems();
  }
}, [selectedCategory]);

// Handle search
const handleSearch = async (e) => {
  e.preventDefault();
  if (searchQuery.trim() === "") return;
  try {
    const res = await api.get(`/menu/?search=${searchQuery}`);
    // 🔑 Handle both paginated & non-paginated
    setSearchResults(res.data.results ? res.data.results : res.data);
  } catch (err) {
    console.error("Error searching items", err);
  }
};

  return (
    <div className="p-6 w-screen">
      {/* Categories Section */}
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`p-4 rounded-lg shadow cursor-pointer ${
              selectedCategory?.id === cat.id ? "bg-orange-200" : "bg-white"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            <h3 className="font-semibold">{cat.name}</h3>
            <p className="text-sm text-gray-600">{cat.description}</p>
          </div>
        ))}
      </div>

      {/* Search Section */}
      <div className="mt-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border p-2 rounded-lg"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Search
          </button>
        </form>
      </div>

      {/* Tabs Section */}
      {/* Tabs Section */}
<div className="mt-8">
  {searchQuery ? (
    <>
      <h2 className="text-xl font-bold mb-2">Search Results</h2>
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {searchResults.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg shadow">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm">{item.description}</p>
              <p className="text-orange-500 font-bold">${item.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No items found</p>
      )}
    </>
  ) : selectedCategory ? (
    <>
      <h2 className="text-xl font-bold mb-2">
        {selectedCategory.name} Items
      </h2>
      {menuItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg shadow">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm">{item.description}</p>
              <p className="text-orange-500 font-bold">${item.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No items available for this category</p>
      )}
    </>
  ) : (
    <p className="text-gray-500">Select a category to view items</p>
  )}
</div>

    </div>
  );
}















// import React, { useEffect, useState } from "react";
// import { getCategories } from "../services/category";

// const Ordering = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         console.warn("No token found. User must log in first.");
//         setLoading(false);
//         return;
//       }
//       const data = await getCategories();
//       setCategories(data);
//       setLoading(false);
//     };

//     fetchCategories();
//   }, []);

//   if (loading) {
//     return <p className="text-center mt-10">Loading categories...</p>;
//   }

//   if (!categories.length) {
//     return <p className="text-center mt-10 text-red-500">No categories available</p>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Food Categories</h1>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {categories.map((cat) => (
//           <div
//             key={cat.id}
//             className="border rounded-xl p-4 text-center shadow hover:shadow-lg transition"
//           >
//             <p className="font-semibold">{cat.name}</p>
//             {cat.description && <p className="text-gray-600">{cat.description}</p>}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Ordering;


// import React from "react";

// export default function Ordering() {
//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Ordering Page</h1>
//       <p>Here you can place new orders.</p>

//       {/* Example placeholder form */}
//       <form className="space-y-4 mt-4">
//         <input
//           type="text"
//           placeholder="Item name"
//           className="border p-2 w-full"
//         />
//         <input
//           type="number"
//           placeholder="Quantity"
//           className="border p-2 w-full"
//         />
//         <button type="submit" className="bg-blue-500 text-white p-2">
//           Place Order
//         </button>
//       </form>
//     </div>
//   );
// }
