import React, { useState, useEffect } from "react";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChefHat, 
  Timer, 
  User, 
  MapPin, 
  Package, 
  Truck, 
  Home,
  RefreshCw,
  Filter,
  Search,
  Eye,
  X,
  Bell
} from "lucide-react";

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Auto-refresh interval
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Check authentication on mount
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, [token]);

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    const baseUrl = 'http://127.0.0.1:8000/api';
    const url = `${baseUrl}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    };
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
        throw new Error('Authentication required');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      const newToken = data.access || data.token;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setIsAuthenticated(true);
      setLoginForm({ username: '', password: '' });
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setOrders([]);
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/orders/');
      setOrders(data.results || data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      await apiCall(`/orders/${orderId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      await fetchOrders(); // Refresh orders
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      
      let interval;
      if (autoRefresh) {
        interval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
      }
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [autoRefresh, isAuthenticated]);

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 bg-red-500 rounded-lg flex items-center justify-center mb-6">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Kitchen Dashboard Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please sign in to access the kitchen management system
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">{loginError}</span>
                </div>
              </div>
            )}
            
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loginLoading ? (
                  <div className="flex items-center">
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Filter and search orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      order.id.toString().includes(searchQuery) ||
      order.table_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Status configuration
  const statusConfig = {
    pending: { 
      label: 'Pending', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
      nextStatus: 'confirmed'
    },
    confirmed: { 
      label: 'Confirmed', 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: CheckCircle,
      nextStatus: 'preparing'
    },
    preparing: { 
      label: 'Preparing', 
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: ChefHat,
      nextStatus: 'ready'
    },
    ready: { 
      label: 'Ready', 
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: Bell,
      nextStatus: 'delivered'
    },
    delivered: { 
      label: 'Delivered', 
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: CheckCircle,
      nextStatus: null
    }
  };

  // Order type icons
  const getOrderTypeIcon = (orderType) => {
    const icons = {
      'dine_in': <Home className="w-4 h-4" />,
      'takeaway': <Package className="w-4 h-4" />,
      'delivery': <Truck className="w-4 h-4" />
    };
    return icons[orderType] || <Home className="w-4 h-4" />;
  };

  // Calculate order total
  const calculateOrderTotal = (order) => {
    return order.order_items?.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0) || 0;
  };

  // Get time since order
  const getTimeSinceOrder = (createdAt) => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const diffMinutes = Math.floor((now - orderTime) / 1000 / 60);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ${diffMinutes % 60}m ago`;
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Kitchen Dashboard</h1>
                <p className="text-sm text-gray-500">Manage incoming orders</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1 rounded-md text-sm ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = orders.filter(order => order.status === status).length;
            const Icon = config.icon;
            
            return (
              <div key={status} className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600">{config.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID, table number, or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 bg-red-500"></div>
            <span className="ml-2 text-gray-600">Loading orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {filterStatus !== 'all' 
                ? `No ${statusConfig[filterStatus]?.label.toLowerCase()} orders at the moment.`
                : 'No orders to display.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const Icon = config.icon;
              const total = calculateOrderTotal(order);
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <div className="flex items-center gap-1">
                            {getOrderTypeIcon(order.order_type)}
                            <span className="text-sm text-gray-600 capitalize">
                              {order.order_type?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            <span>{getTimeSinceOrder(order.created_at)}</span>
                          </div>
                          
                          {order.table_number && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>Table {order.table_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm border ${config.color}`}>
                        <div className="flex items-center gap-1">
                          <Icon className="w-3 h-3" />
                          <span>{config.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 mb-4">
                      {order.order_items?.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">
                            {item.quantity}x {item.item_name}
                          </span>
                          <span className="text-gray-600">
                            ₵{(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      
                      {order.order_items?.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{order.order_items.length - 3} more items
                        </div>
                      )}
                    </div>

                    {/* Order Total */}
                    <div className="border-t pt-3 mb-4">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total:</span>
                        <span className="text-orange-600">₵{total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      
                      {config.nextStatus && (
                        <button
                          onClick={() => updateOrderStatus(order.id, config.nextStatus)}
                          disabled={updatingStatus === order.id}
                          className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors text-sm flex items-center justify-center gap-1"
                        >
                          {updatingStatus === order.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          {updatingStatus === order.id 
                            ? 'Updating...' 
                            : `Mark ${statusConfig[config.nextStatus]?.label}`
                          }
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order #{selectedOrder.id} Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className={`mt-1 px-3 py-1 rounded-full text-sm inline-flex items-center gap-1 border ${statusConfig[selectedOrder.status]?.color || ''}`}>
                    {React.createElement(statusConfig[selectedOrder.status]?.icon || Clock, { className: "w-3 h-3" })}
                    <span>{statusConfig[selectedOrder.status]?.label || selectedOrder.status}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Type</label>
                  <div className="mt-1 flex items-center gap-1 text-gray-900">
                    {getOrderTypeIcon(selectedOrder.order_type)}
                    <span className="capitalize">{selectedOrder.order_type?.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <div className="mt-1 text-gray-900">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </div>
                </div>
                
                {selectedOrder.table_number && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Table Number</label>
                    <div className="mt-1 text-gray-900">
                      Table {selectedOrder.table_number}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{item.item_name}</div>
                        <div className="text-sm text-gray-600">₵{parseFloat(item.price).toFixed(2)} each</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">Qty: {item.quantity}</div>
                        <div className="text-sm text-orange-600 font-semibold">
                          ₵{(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-orange-600">₵{calculateOrderTotal(selectedOrder).toFixed(2)}</span>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="flex gap-2">
                {Object.entries(statusConfig).map(([status, config]) => {
                  if (status === selectedOrder.status) return null;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, status);
                        setSelectedOrder(null);
                      }}
                      disabled={updatingStatus === selectedOrder.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${config.color.replace('100', '500').replace('800', 'white')} hover:opacity-90 disabled:opacity-50`}
                    >
                      Update to {config.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}