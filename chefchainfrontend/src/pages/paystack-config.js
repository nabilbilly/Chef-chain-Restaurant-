// Paystack Configuration
// Replace these with your actual Paystack keys from your dashboard

export const PAYSTACK_CONFIG = {
  // Test keys (replace with live keys for production)
  publicKey: 'pk_test_52c55ad47c788f26e3b859362da880a39ca0ca93', // Replace with your actual public key
  
  // Currency settings
  currency: 'GHS', // Ghana Cedis
  
  // Payment channels (optional - remove to allow all channels)
  channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
  
  // Metadata for tracking
  metadata: {
    source: 'restaurant_pos',
    version: '1.0'
  }
};

// Helper function to generate unique reference
export const generatePaymentReference = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `order_${timestamp}_${random}`;
};

// Helper function to convert amount to kobo (Paystack expects amount in kobo)
export const convertToKobo = (amount) => {
  return Math.round(parseFloat(amount) * 100);
};

// Helper function to format amount for display
export const formatAmount = (amount) => {
  return parseFloat(amount).toFixed(2);
};
