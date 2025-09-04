import React, { useState, useEffect } from "react";
import api from "../services/api"; // your axios instance
import { Search, ShoppingCart, Plus, Minus, X, Filter, Grid, List, Clock, Star, CheckCircle, AlertCircle } from "lucide-react";

export default function Ordering() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [cart, setCart] = useState([]); 
  const [viewMode, setViewMode] = useState('grid');
  const [showCart, setShowCart] = useState(false);

  // 1. ADD TOAST STATE (add these to your existing state)
const [toastMessage, setToastMessage] = useState("");
const [showToast, setShowToast] = useState(false);

  // Order state
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [tableNumber, setTableNumber] = useState("");
  const [orderType, setOrderType] = useState("dine_in"); // dine_in, takeaway, delivery
  const [customerId, setCustomerId] = useState(1); // You might get this from auth context

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
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

  // Fetch items when category changes (or load all if none selected)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        let res;
        if (selectedCategory) {
          res = await api.get(`/menu/?category=${selectedCategory.id}`);
        } else {
          res = await api.get("/menu/");
        }
        setMenuItems(res.data.results ? res.data.results : res.data);
      } catch (err) {
        console.error("Error fetching items", err);
      }
    };

    fetchItems();
  }, [selectedCategory]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await api.get("/menu/");
      setMenuItems(res.data.results ? res.data.results : res.data);
    } catch (err) {
      console.error("Error fetching menu items", err);
    }
  };
    const showToastMessage = (message) => {
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    };
      // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (searchQuery.trim() === "") {
        res = await api.get("/menu/");
      } else {
        res = await api.get(`/menu/?search=${searchQuery}`);
      }
      setMenuItems(res.data.results ? res.data.results : res.data);
    } catch (err) {
      console.error("Error searching items", err);
    }
  };

  // Filter by category (if selected)
  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory.id)
    : menuItems;

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItem = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // 3. UPDATE YOUR ADDTOCART FUNCTION (replace your existing addToCart function)
const addToCart = (item) => {
  setCart(prevCart => {
    const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      showToastMessage(`${item.name} quantity updated in cart!`);
      return prevCart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      showToastMessage(`${item.name} added to cart!`);
      return [...prevCart, { ...item, quantity: 1 }];
    }
  });
};
// 4. ADD TOAST NOTIFICATION JSX (add this after your existing success/error messages)
{showToast && (
  <div className="fixed top-20 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-2 transform transition-all duration-300">
    <CheckCircle className="w-5 h-5" />
    <span>{toastMessage}</span>
  </div>
)}
  // Update cart quantity
  const updateCartQuantity = (itemId, change) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Place order function using your cart-based system
  const placeOrder = async () => {
    if (cart.length === 0) {
      setOrderError("Your cart is empty!");
      return;
    }

    if (!tableNumber && orderType === "dine_in") {
      setOrderError("Please enter a table number for dine-in orders");
      return;
    }

    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      // Step 1: Add all items to the backend cart first
      console.log("Adding items to cart...");
      for (const cartItem of cart) {
        console.log("Adding item:", cartItem);
        await api.post("/cart/add/", {
          item: cartItem.id,
          quantity: cartItem.quantity
        });
      }

      // Step 2: Create the order
      console.log("Creating order...");
      const orderData = {
        table_number: orderType === "dine_in" ? tableNumber : null,
        order_type: orderType
      };
      
      console.log("Order data being sent:", orderData);
      const response = await api.post("/orders/create/", orderData);
      console.log("Order created successfully:", response.data);

      // Success - clear cart and show success message
      setOrderSuccess(true);
      clearCart();
      setTableNumber("");
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setOrderSuccess(false);
      }, 3000);

    } catch (error) {
      console.error("Error placing order:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      let errorMessage = "Failed to place order. Please try again.";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          // Handle field validation errors
          const errors = Object.entries(error.response.data).map(([field, messages]) => {
            const messageArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${messageArray.join(', ')}`;
          });
          errorMessage = errors.join('; ');
        }
      }
      
      setOrderError(errorMessage);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Get category icon
  const getCategoryIcon = (name) => {
    const iconMap = {
      'Pizza': '🍕', 'Burger': '🍔', 'Pasta': '🍝', 'Salad': '🥗',
      'Dessert': '🍰', 'Drink': '🥤', 'Pastries': '🥖', 'Main': '🍽️', 
      'Breakfast': '🥞', 'Lunch': '🍱', 'Dinner': '🍛', 'Snack': '🍟', 
      'Bread': '🍞','Rice Dish': '🍚'
    };
    return iconMap[name] || '🍽️';
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const currentItems = searchQuery ? searchResults : menuItems;

  return (
    <div className="min-h-screen w-screen bg-gray-50">
      {/* Success/Error Messages */}
      {orderSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Order placed successfully!</span>
        </div>
      )}
      
      {orderError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <div>
            <span>{orderError}</span>
            <button 
              onClick={() => setOrderError(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Restaurant Menu</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <div className="flex gap-8 "> */}
        <div className="h-screen pt-16 flex">
          {/* Left Sidebar */}
          {/* <div className="w-80 flex-shrink-0"> */}
          <div className="w-80 flex-shrink-0 bg-white border-r border-white overflow-y-auto ">
            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Search Menu
              </h3>

              <form onSubmit={handleSearch} className="flex gap-2 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search delicious food..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🍽️</span>
                    <span className="font-medium">All Items</span>
                  </div>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory?.id === cat.id 
                        ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getCategoryIcon(cat.name)}</span>
                      <div>
                        <div className="font-medium">{cat.name}</div>
                        <div className="text-sm text-gray-500">{cat.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Content Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? 'Search Results' : selectedCategory ? selectedCategory.name : 'All Menu Items'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {currentItems.length} items available
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Filter & Sort</span>
              </div>
            </div>

            {/* Menu Items */}
            {currentItems.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 ${
                      viewMode === 'list' ? 'flex gap-4 p-4' : 'p-6'
                    }`}
                  >
                    {/* Item Image */}
                    <div
                      className={`rounded-lg overflow-hidden flex items-center justify-center ${
                        viewMode === "list" ? "w-20 h-20 flex-shrink-0" : "w-full h-48 mb-4"
                      }`}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-orange-100">
                          <span className="text-4xl">🍽️</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className={`flex items-start justify-between ${viewMode === 'list' ? 'mb-2' : 'mb-3'}`}>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">(4.5)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-orange-600">
                            ₵{parseFloat(item.price).toFixed(2)}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>15-20 min</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        {/* Toast Notification - Add this right after your existing success/error messages */}
                          {showToast && (
                            <div className="fixed top-20 right-4 bg-orange-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-2 transform transition-all duration-300 ease-in-out">
                              <CheckCircle className="w-5 h-5" />
                              <span>{toastMessage}</span>
                            </div>
                          )}

                      {/* Or with different colors based on message type */}
                        {showToast && (
                          <div className={`fixed top-20 right-4 p-4 rounded-lg  z-50 flex items-center gap-2 transform transition-all duration-300 ease-in-out ${
                            toastMessage.includes('added') 
                              ? 'bg-orange-500 text-white' 
                              : toastMessage.includes('updated') 
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-500 text-white'
                          }`}>
                            <CheckCircle className="w-5 h-5" />
                            <span>{toastMessage}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">
                  {searchQuery 
                    ? `No results for "${searchQuery}". Try a different search term.`
                    : selectedCategory 
                      ? `No items available in ${selectedCategory.name} category.`
                      : 'Select a category to view items.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          {showCart && (
           <div className="w-80 bg-white border-l border-gray-200 fixed right-0 top-16 h-[calc(100vh-4rem)] flex flex-col">
            {/* <div className="w-80 bg-white border-l items-center border-gray-200 fixed flex-shrink-0 overflow-y-auto"> */}
              {/* <div className="flex items-center justify-between p-4 border-b"> */}
              <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                <h3 className="text-lg font-semibold">Your Order</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Scrollable Cart Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length > 0 ? (
                <>
                  {/* Order Type Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Type
                    </label>
                    <select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="dine_in">Dine In</option>
                      <option value="takeaway">Takeaway</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>

                  {/* Table Number for Dine In */}
                  {orderType === "dine_in" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Table Number *
                      </label>
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="Enter table number"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span>🍽️</span>

                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-orange-600 font-semibold">₵{parseFloat(item.price).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            <Minus className="w-3 h-3" /> -
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600"
                          >
                            <Plus className="w-3 h-3" /> +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-6 h-6 rounded-full text-white flex items-center justify-center hover:bg-red-600 ml-2"
                          >
                            <X className="w-3 h-3" /> 🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₵{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>₵{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>₵{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={placeOrder}
                    disabled={isPlacingOrder || (orderType === "dine_in" && !tableNumber)}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPlacingOrder ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Placing Order...
                      </div>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                  
                  <button
                    onClick={clearCart}
                    className="w-full mt-2 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    Clear Cart
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🛒</div>
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}