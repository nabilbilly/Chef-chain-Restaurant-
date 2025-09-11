import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // API Configuration - UPDATE THESE URLs TO MATCH YOUR BACKEND
  const API_BASE_URL = 'http://localhost:8000';
  const ORDER_HISTORY_URL = API_BASE_URL + '/api/orders/history/';

  // Enhanced token retrieval with debugging
  const getAuthToken = () => {
    const possibleKeys = [
      'access_token',
      'token',
      'auth_token',
      'accessToken',
      'authToken',
      'jwt_token'
    ];

    for (const key of possibleKeys) {
      const token = localStorage.getItem(key);
      if (token) {
        console.log('Found token with key: ' + key);
        return token;
      }
    }

    for (const key of possibleKeys) {
      const token = sessionStorage.getItem(key);
      if (token) {
        console.log('Found token in sessionStorage with key: ' + key);
        return token;
      }
    }

    console.log('No authentication token found - will make public request');
    return null;
  };

  // Debug function to check API URLs and responses
  const debugAPI = async () => {
    console.log('=== API Debug Info ===');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('ORDER_HISTORY_URL:', ORDER_HISTORY_URL);
    console.log('Current window location:', window.location.href);
    
    const token = getAuthToken();
    console.log('Token available:', !!token);

    try {
      // Test if the API base URL is reachable
      console.log('Testing API base URL...');
      const testResponse = await fetch(API_BASE_URL + '/api/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Base API test response status:', testResponse.status);
      
      if (!testResponse.ok) {
        const text = await testResponse.text();
        console.log('Base API test response text:', text.substring(0, 200));
      }

      // Test the specific endpoint
      console.log('Testing order history endpoint...');
      
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }

      const historyResponse = await fetch(ORDER_HISTORY_URL, {
        method: 'GET',
        headers: headers,
      });
      
      console.log('History endpoint response status:', historyResponse.status);
      
      const responseText = await historyResponse.text();
      console.log('History endpoint raw response:', responseText.substring(0, 500));
      
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('Parsed JSON response:', jsonResponse);
      } catch (e) {
        console.error('Response is not valid JSON:', e);
      }
      
    } catch (error) {
      console.error('API debug error:', error);
    }
  };

  // Fetch order history from API
  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();

      console.log('Fetching from URL:', ORDER_HISTORY_URL);

      // Prepare headers - only add Authorization if token exists
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
        console.log('Making authenticated request');
      } else {
        console.log('Making public request (no token)');
      }

      const response = await fetch(ORDER_HISTORY_URL, {
        method: 'GET',
        headers: headers,
      });

      console.log('Response status:', response.status);
      console.log('Response content-type:', response.headers.get('content-type'));

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response received:', responseText.substring(0, 200));
        throw new Error('Server returned ' + response.status + '. Expected JSON but got: ' + contentType + '. This usually means the API endpoint doesn\'t exist or there\'s a routing issue.');
      }

      if (response.status === 401) {
        const errorData = await response.json();
        console.error('401 Error details:', errorData);
        setError('Authentication required. Please log in to view your order history.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error('HTTP ' + response.status + ': ' + (errorData.detail || 'Unknown error'));
      }

      const data = await response.json();
      console.log('Order history data:', data);
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load order history: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Test authentication endpoint
  const testAuth = async () => {
    const token = getAuthToken();
    
    if (!token) {
      console.log('No token found - testing public endpoints');
    }

    try {
      console.log('Testing authentication with various endpoints...');
      
      // Test different endpoints to see which ones work
      const testEndpoints = [
        API_BASE_URL + '/api/categories/',
        API_BASE_URL + '/api/menu/',
        API_BASE_URL + '/api/orders/',
        ORDER_HISTORY_URL
      ];

      for (const endpoint of testEndpoints) {
        try {
          console.log('Testing endpoint: ' + endpoint);
          
          const headers = {
            'Content-Type': 'application/json',
          };

          if (token) {
            headers['Authorization'] = 'Bearer ' + token;
          }

          const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers,
          });

          console.log(endpoint + ' - Status: ' + response.status + ', Content-Type: ' + response.headers.get('content-type'));
          
          if (response.ok) {
            const data = await response.json();
            console.log(endpoint + ' - Success:', data);
          } else {
            const text = await response.text();
            console.log(endpoint + ' - Error:', text.substring(0, 200));
          }
        } catch (error) {
          console.log(endpoint + ' - Exception:', error.message);
        }
      }
    } catch (error) {
      console.error('Auth test error:', error);
    }
  };

  // Fetch detailed order information
  const fetchOrderDetails = async (orderId) => {
    try {
      const token = getAuthToken();
      const detailUrl = API_BASE_URL + '/api/orders/history/' + orderId + '/';
      
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }

      const response = await fetch(detailUrl, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }

      const data = await response.json();
      setSelectedOrder(data);
      setShowModal(true);
    } catch (err) {
      setError('Failed to load order details: ' + err.message);
      console.error('Error fetching order details:', err);
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

  // Get status badge class
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your order history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Order History</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="space-y-2">
            <div className="text-sm text-red-600">
              <p><strong>Troubleshooting:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Make sure your Django server is running</li>
                <li>Check if the API URL is correct: <code className="bg-red-100 px-1 rounded">{ORDER_HISTORY_URL}</code></li>
                <li>Verify the endpoint exists in your Django urls.py</li>
                <li>Check browser console for detailed error messages</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <button 
              onClick={fetchOrderHistory} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={testAuth} 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Test Auth
            </button>
            <button 
              onClick={debugAPI} 
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Debug API
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-screen mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Order History</h2>
        <div className="flex space-x-2">
          {/* <button 
            onClick={debugAPI}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md transition-colors"
          >
            Debug API
          </button> */}
          <Link to="/ordering" className="flex items-center p-2 text-orange-500 hover:orange-400 transition-colors">
                 <button className="text-sm bg-orange-500 hover:bg-gray-200 text-white px-3 py-1 rounded-md transition-colors" >
                   🍰 Back to Kitchen </button> 
          </Link>
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-2">You haven't placed any orders yet.</p>
            <p className="text-gray-500">Start exploring our menu and place your first order!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.results?.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(order.created_at)}</p>
                  </div>
                  <span className={'px-3 py-1 rounded-full text-sm font-medium ' + getStatusBadge(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{order.order_type.replace('_', ' ')}</span>
                  </div>
                  {order.table_number && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Table:</span>
                      <span className="font-medium">{order.table_number}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{order.order_items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold text-green-600">₵{calculateOrderTotal(order.order_items || [])}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Items:</h4>
                  <div className="space-y-2">
                    {order.order_items?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{item.quantity}x {item.item_name}</span>
                        <span className="font-medium">₵{item.total_price || (item.quantity * item.price).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.order_items?.length > 3 && (
                      <p className="text-xs text-gray-500 italic">
                        +{order.order_items.length - 3} more item(s)
                      </p>
                    )}
                  </div>
                </div>

                <button
                  className="w-full bg-orange-500 hover:bg-orange-400 text-white py-2 px-4 rounded-md transition-colors duration-200 font-medium"
                  onClick={() => fetchOrderDetails(order.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Order #{selectedOrder.id} Details</h3>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowModal(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">Order Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Order Date:</span>
                    <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <p className="font-medium">
                      <span className={'inline-block px-2 py-1 rounded-full text-xs ' + getStatusBadge(selectedOrder.status)}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Type:</span>
                    <p className="font-medium capitalize">{selectedOrder.order_type.replace('_', ' ')}</p>
                  </div>
                  {selectedOrder.table_number && (
                    <div>
                      <span className="text-sm text-gray-600">Table:</span>
                      <p className="font-medium">{selectedOrder.table_number}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b-2 border-orange-400">Items Ordered</h4>
                <div className="space-y-3 mb-6">
                  {selectedOrder.order_items?.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{item.item_name}</h5>
                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                          <p>Quantity: {item.quantity}</p>
                          <p>Unit Price: ${item.price}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-orange-500 text-lg">
                          ${item.total_price || (item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-gray-200 pt-4 text-right">
                  <h4 className="text-xl font-bold text-gray-900">
                    Total: ${calculateOrderTotal(selectedOrder.order_items || [])}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;