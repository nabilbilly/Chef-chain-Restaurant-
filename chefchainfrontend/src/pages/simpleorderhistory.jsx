import React, { useState, useEffect } from 'react';

const SimpleOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get authentication token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('access_token'); // Adjust this based on how you store tokens
  };

  // Fetch order history from API
  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        setError('Please log in to view order history');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/orders/history/', { // Adjust API base URL as needed
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load order history: ' + err.message);
      console.error('Error fetching order history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price for an order
  const calculateOrderTotal = (orderItems) => {
    return orderItems.reduce((total, item) => {
      const itemTotal = item.quantity * parseFloat(item.price || 0);
      return total + itemTotal;
    }, 0).toFixed(2);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get status badge classes
  const getStatusBadge = (status) => {
    const statusClasses = {
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-center items-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-600">Loading your order history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 mb-4">{error}</p>
          <button 
            onClick={fetchOrderHistory}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Order History</h2>
      
      {orders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <p className="text-gray-600 text-lg mb-2">You haven't placed any orders yet.</p>
          <p className="text-gray-500">Start exploring our menu and place your first order!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-gray-500 mt-1">{formatDate(order.created_at)}</p>
                  </div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 ${getStatusBadge(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Type:</span>
                    <p className="text-gray-900 capitalize">{order.order_type.replace('_', ' ')}</p>
                  </div>
                  {order.table_number && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Table:</span>
                      <p className="text-gray-900">{order.table_number}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Items:</h4>
                  <div className="space-y-3">
                    {order.order_items?.map((item, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-gray-700">{item.quantity}x {item.item_name}</span>
                        <span className="font-medium text-gray-900">
                          ${item.total_price || (item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-green-600">
                        ${calculateOrderTotal(order.order_items || [])}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleOrderHistory;