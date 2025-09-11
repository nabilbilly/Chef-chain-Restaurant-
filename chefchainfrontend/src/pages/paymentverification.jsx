// PaymentVerification.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paystackAPI } from '../services/api';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (reference) {
        try {
          const response = await paystackAPI.verifyPayment(reference);
          setStatus(response.data.status);
          setMessage(response.data.message);
          setOrderId(response.data.order_id);
          
          // Redirect to order page after 3 seconds if successful
          if (response.data.status === 'success') {
            setTimeout(() => {
              navigate(`/orders/${response.data.order_id}`);
            }, 3000);
          }
        } catch (err) {
          setStatus('error');
          setMessage(err.response?.data?.error || 'Verification failed');
        }
      }
    };

    verifyPayment();
  }, [reference, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
      default:
        return <Loader className="w-12 h-12 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'failed':
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full">
        <div className="text-center">
          {getStatusIcon()}
          <h2 className="text-2xl font-bold mt-4 mb-2">
            {status === 'verifying' && 'Verifying Payment...'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'failed' && 'Payment Failed'}
            {status === 'error' && 'Verification Error'}
          </h2>
          
          <div className={`border px-4 py-3 rounded mb-4 ${getStatusColor()}`}>
            <p>{message}</p>
            {reference && <p className="text-sm mt-2">Reference: {reference}</p>}
          </div>

          {status === 'success' && orderId && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
              <p>You will be redirected to your order page shortly...</p>
            </div>
          )}

          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </button>
            
            {orderId && (
              <button
                onClick={() => navigate(`/orders/${orderId}`)}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
              >
                View Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;