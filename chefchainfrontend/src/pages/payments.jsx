import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, CheckCircle, XCircle, Loader } from 'lucide-react';

const PaystackPayment = () => {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [paymentData, setPaymentData] = useState(null);
  const [userBalance, setUserBalance] = useState(0);

  // Your Django backend base URL - update this to match your setup
  const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Change this to your actual backend URL

  // Function to get auth headers (assuming you store JWT token in localStorage)
  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken'); // Adjust based on how you store auth token
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const initiatePayment = async () => {
    if (!amount || !email) {
      showMessage('Please enter both amount and email', 'error');
      return;
    }

    if (parseFloat(amount) <= 0) {
      showMessage('Amount must be greater than 0', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/payments/initiate/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          amount: parseFloat(amount),
          email: email
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentData(data);
        launchPaystackPopup(data);
      } else {
        showMessage(data.error || 'Failed to initiate payment', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please check your connection.', 'error');
      console.error('Payment initiation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const launchPaystackPopup = (data) => {
    if (!window.PaystackPop) {
      showMessage('Paystack library not loaded. Please refresh the page.', 'error');
      return;
    }

    // Debug: Log the data being sent to Paystack
    console.log('Paystack configuration:', {
      key: data.paystack_pub_key,
      email: data.email,
      amount: data.amount_value,
      ref: data.ref,
      currency: 'NGN'
    });

    // Validate required fields
    if (!data.paystack_pub_key || !data.paystack_pub_key.startsWith('pk_')) {
      showMessage('Invalid Paystack public key', 'error');
      return;
    }

    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      showMessage('Invalid email format', 'error');
      return;
    }

    if (!data.amount_value || data.amount_value <= 0) {
      showMessage('Invalid amount', 'error');
      return;
    }

    const handler = window.PaystackPop.setup({
      key: data.paystack_pub_key,
      email: data.email,
      amount: data.amount_value, // Amount in kobo
      ref: data.ref,
      currency: 'NGN',
      callback: function(response) {
        console.log('Payment successful:', response);
        verifyPayment(response.reference);
      },
      onClose: function() {
        showMessage('Payment cancelled', 'info');
      }
    });

    handler.openIframe();
  };

  const verifyPayment = async (reference) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/payments/verify/${reference}/`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(data.message, 'success');
        setUserBalance(data.balance);
        // Clear form
        setAmount('');
        setEmail('');
        setPaymentData(null);
      } else {
        showMessage(data.error || 'Payment verification failed', 'error');
      }
    } catch (error) {
      showMessage('Error verifying payment. Please contact support.', 'error');
      console.error('Payment verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Fund Your Wallet</h2>
          <p className="text-gray-600 mt-2">Add money to your wallet securely with Paystack</p>
          {userBalance > 0 && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 font-medium">Current Balance: ₦{userBalance.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Debug Info - Remove this in production */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Debug Info (Remove in production):</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>API URL: {API_BASE_URL}/payments/initiate/</p>
            <p>Token exists: {localStorage.getItem('authToken') || localStorage.getItem('token') || localStorage.getItem('access_token') || localStorage.getItem('accessToken') || sessionStorage.getItem('authToken') || sessionStorage.getItem('token') ? 'Yes' : 'No'}</p>
            <p>Headers: {JSON.stringify(getAuthHeaders(), null, 2)}</p>
          </div>
        </div>
        {message && (
          <div className={`p-4 rounded-lg flex items-center space-x-2 ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : messageType === 'error'
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}>
            {messageType === 'success' && <CheckCircle className="w-5 h-5" />}
            {messageType === 'error' && <XCircle className="w-5 h-5" />}
            <span>{message}</span>
          </div>
        )}

        {/* Payment Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₦)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₦</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>

            {/* Pay Button */}
            <button
              onClick={initiatePayment}
              disabled={isLoading || !amount || !email}
              className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors ${
                isLoading || !amount || !email
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay with Paystack
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Amount Selection */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Select</h3>
          <div className="grid grid-cols-3 gap-3">
            {[1000, 2000, 5000, 10000, 20000, 50000].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                disabled={isLoading}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                ₦{quickAmount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Secure Payment:</strong> Your payment is processed securely by Paystack. We never store your card details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaystackPayment;