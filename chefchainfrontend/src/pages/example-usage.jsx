// Example usage of the Payment component with Paystack integration
import React, { useState } from 'react';
import Payment from './payment.jsx';

const RestaurantApp = () => {
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Example cart data
  const cart = [
    { id: 1, name: 'Jollof Rice', price: '25.00', quantity: 2 },
    { id: 2, name: 'Grilled Chicken', price: '35.00', quantity: 1 },
    { id: 3, name: 'Soft Drink', price: '5.00', quantity: 2 }
  ];

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Order details
  const orderType = 'dine_in';
  const tableNumber = '5';

  // Handle order placement
  const placeOrder = async (paymentData) => {
    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      console.log('Placing order with payment data:', paymentData);

      // Simulate API call to your backend
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          subtotal,
          tax,
          total,
          orderType,
          tableNumber,
          payment: paymentData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const result = await response.json();
      console.log('Order placed successfully:', result);

      // Close payment popup on success
      setShowPaymentPopup(false);
      
      // Show success message or redirect
      alert('Order placed successfully!');

    } catch (error) {
      console.error('Order placement error:', error);
      setOrderError(error.message || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Restaurant POS</h1>
        
        {/* Cart Display */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Your Order</h2>
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>₵{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 mt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₵{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>₵{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₵{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={() => setShowPaymentPopup(true)}
          className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          Proceed to Payment
        </button>

        {/* Payment Component */}
        <Payment
          showPaymentPopup={showPaymentPopup}
          setShowPaymentPopup={setShowPaymentPopup}
          cart={cart}
          subtotal={subtotal}
          tax={tax}
          total={total}
          orderType={orderType}
          tableNumber={tableNumber}
          placeOrder={placeOrder}
          isPlacingOrder={isPlacingOrder}
          orderError={orderError}
          setOrderError={setOrderError}
        />
      </div>
    </div>
  );
};

export default RestaurantApp;
