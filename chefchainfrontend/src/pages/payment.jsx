import React, { useState } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";

const Payment = ({
  showPaymentPopup,
  setShowPaymentPopup,
  cart,
  subtotal,
  tax,
  total,
  orderType,
  tableNumber,
  placeOrder,
  isPlacingOrder,
  orderError,
  setOrderError,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showLoaderPopup, setShowLoaderPopup] = useState(false);

  const handlePlaceOrder = async () => {
    setOrderError(null);

    if (paymentMethod === "mobile_money") {
      if (!customerName.trim()) {
        setOrderError("Please enter customer name");
        return;
      }
      if (!customerPhone.trim()) {
        setOrderError("Please enter customer phone number");
        return;
      }

      // Show loader popup for Mobile Money
      setShowLoaderPopup(true);

      setTimeout(async () => {
        setShowLoaderPopup(false);

        await placeOrder({
          paymentMethod,
          customerName,
          customerPhone,
        });
      }, 10000); // 10 sec wait
    } else {
      // Cash / Others → No extra validation
      await placeOrder({
        paymentMethod,
        customerName,
        customerPhone,
      });
    }
  };

  if (!showPaymentPopup) return null;

  return (
    <>
      {/* Main Payment Popup */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Popup Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
              <button
                onClick={() => setShowPaymentPopup(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>₵{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mt-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₵{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>₵{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₵{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Type and Table Info */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Order Type:</span>
                <span className="capitalize">{orderType.replace("_", " ")}</span>
              </div>
              {orderType === "dine_in" && tableNumber && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="font-medium">Table Number:</span>
                  <span>{tableNumber}</span>
                </div>
              )}
            </div>

            {/* Customer Information */}
            {paymentMethod === "mobile_money" && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            )}
            {/* Error Message */}
            {orderError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 text-sm">{orderError}</span>
                <button
                  onClick={() => setOrderError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "cash", label: "Cash", icon: "💵" },
                  { key: "mobile_money", label: "Mobile Money", icon: "📱" },
                ].map((method) => (
                  <button
                    key={method.key}
                    onClick={() => setPaymentMethod(method.key)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      paymentMethod === method.key
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <div className="font-medium text-sm">{method.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentPopup(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : paymentMethod === "cash" ? (
                  `Proceed Order - ₵${total.toFixed(2)}`
                ) : (
                  `Pay with Mobile Money`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loader Popup for Mobile Money */}
      {showLoaderPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 text-center w-96">
            <h3 className="text-lg font-semibold mb-2">Please check your phone</h3>
            <p className="text-gray-600 mb-4">
              Enter your PIN to approve the Mobile Money transaction.
            </p>
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-gray-500">Waiting for approval (10s)...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
