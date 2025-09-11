# Paystack Integration Setup Guide

## Overview
This guide will help you set up Paystack inline payment integration for your restaurant POS system.

## Prerequisites
1. A Paystack account (sign up at https://paystack.com)
2. Your Paystack API keys (public and secret)

## Setup Steps

### 1. Get Your Paystack API Keys
1. Log in to your Paystack Dashboard
2. Go to Settings > API Keys & Webhooks
3. Copy your **Public Key** and **Secret Key**
4. For testing, use the test keys (they start with `pk_test_` and `sk_test_`)
5. For production, use the live keys (they start with `pk_live_` and `sk_live_`)

### 2. Configure Your Keys
1. Open `paystack-config.js`
2. Replace `'pk_test_your_public_key_here'` with your actual Paystack public key
3. Example:
   ```javascript
   publicKey: 'pk_test_abc123def456ghi789', // Your actual public key
   ```

### 3. Currency and Channels
The integration is configured for Ghana Cedis (GHS). If you need a different currency:
1. Open `paystack-config.js`
2. Change the `currency` value:
   ```javascript
   currency: 'NGN', // For Nigerian Naira
   currency: 'USD', // For US Dollars
   currency: 'GHS', // For Ghana Cedis (default)
   ```

### 4. Payment Channels
You can customize which payment methods are available:
```javascript
channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
```

Remove any channels you don't want to support.

### 5. Backend Integration (Important!)
For production, you MUST verify payments on your backend for security:

1. Create an API endpoint to verify payments:
   ```javascript
   // Example backend endpoint (Node.js/Express)
   app.post('/api/verify-payment', async (req, res) => {
     const { reference } = req.body;
     
     try {
       const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
         headers: {
           'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
         }
       });
       
       const data = await response.json();
       
       if (data.status && data.data.status === 'success') {
         // Payment verified successfully
         res.json({ success: true, data: data.data });
       } else {
         res.status(400).json({ success: false, message: 'Payment verification failed' });
       }
     } catch (error) {
       res.status(500).json({ success: false, message: 'Verification error' });
     }
   });
   ```

2. Update the `verifyPayment` method in `paystack-handler.js` to call your backend endpoint.

### 6. Testing
1. Use test card numbers provided by Paystack:
   - **Successful payment**: 4084084084084081
   - **Insufficient funds**: 4084084084084081 (with CVV 408)
   - **Invalid card**: 4084084084084082

2. Test different scenarios:
   - Successful payments
   - Failed payments
   - Cancelled payments

### 7. Webhooks (Optional but Recommended)
Set up webhooks to receive real-time payment notifications:

1. In your Paystack Dashboard, go to Settings > API Keys & Webhooks
2. Add your webhook URL (e.g., `https://yourdomain.com/webhook/paystack`)
3. Select the events you want to receive (e.g., `charge.success`)
4. Implement webhook handling in your backend

## Security Best Practices

1. **Never expose your secret key** in frontend code
2. **Always verify payments** on your backend
3. **Use HTTPS** in production
4. **Validate webhook signatures** to ensure they're from Paystack
5. **Store sensitive data securely** (use environment variables)

## Environment Variables
Create a `.env` file for your backend:
```
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
```

## Troubleshooting

### Common Issues:
1. **"Paystack script not loaded"**: Check your internet connection and ensure the script URL is accessible
2. **"Invalid public key"**: Verify you're using the correct public key from your Paystack dashboard
3. **Payment fails immediately**: Check if the amount is valid (must be greater than 0)
4. **Currency not supported**: Ensure the currency is supported in your country

### Debug Mode:
Enable console logging to see detailed payment information:
```javascript
console.log('Payment data:', paymentData);
```

## Support
- Paystack Documentation: https://paystack.com/docs
- Paystack Support: support@paystack.com
- Test your integration: https://paystack.com/docs/payments/test-payments

## Next Steps
1. Test the integration thoroughly
2. Set up payment verification on your backend
3. Configure webhooks for real-time updates
4. Switch to live keys when ready for production
5. Monitor transactions in your Paystack dashboard
