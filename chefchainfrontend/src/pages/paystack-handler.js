// Paystack Payment Handler
import { PAYSTACK_CONFIG, generatePaymentReference, convertToKobo } from './paystack-config.js';

export class PaystackHandler {
  constructor() {
    this.isScriptLoaded = false;
    this.loadScript();
  }

  // Load Paystack script dynamically
  loadScript() {
    return new Promise((resolve, reject) => {
      if (this.isScriptLoaded || window.PaystackPop) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      
      script.onload = () => {
        this.isScriptLoaded = true;
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Paystack script'));
      };
      
      document.head.appendChild(script);
    });
  }

  // Initialize payment
  async initiatePayment({
    email,
    amount,
    customerName,
    customerPhone,
    orderType,
    tableNumber,
    cart,
    onSuccess,
    onError,
    onClose
  }) {
    try {
      await this.loadScript();

      if (!window.PaystackPop) {
        throw new Error('Paystack script not loaded');
      }

      const reference = generatePaymentReference();
      const amountInKobo = convertToKobo(amount);

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_CONFIG.publicKey,
        email: email,
        amount: amountInKobo,
        currency: PAYSTACK_CONFIG.currency,
        ref: reference,
        channels: PAYSTACK_CONFIG.channels,
        metadata: {
          ...PAYSTACK_CONFIG.metadata,
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: customerName
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: customerPhone
            },
            {
              display_name: "Order Type",
              variable_name: "order_type",
              value: orderType
            },
            ...(orderType === "dine_in" && tableNumber ? [{
              display_name: "Table Number",
              variable_name: "table_number",
              value: tableNumber
            }] : []),
            {
              display_name: "Cart Items",
              variable_name: "cart_items",
              value: JSON.stringify(cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })))
            }
          ]
        },
        callback: function(response) {
          console.log('Paystack payment successful:', response);
          
          // Verify payment on your backend here
          // For now, we'll call the success callback
          if (onSuccess) {
            onSuccess({
              reference: response.reference,
              transactionId: response.trans,
              status: response.status,
              message: response.message
            });
          }
        },
        onClose: function() {
          console.log('Paystack payment cancelled');
          if (onClose) {
            onClose();
          }
        }
      });

      handler.openIframe();

    } catch (error) {
      console.error('Paystack payment error:', error);
      if (onError) {
        onError(error.message || 'Payment initialization failed');
      }
    }
  }

  // Verify payment (you should implement this on your backend)
  async verifyPayment(reference) {
    try {
      // This should be done on your backend for security
      // Here's an example of what the backend call might look like:
      
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference })
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const paystackHandler = new PaystackHandler();
