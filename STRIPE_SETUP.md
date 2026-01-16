# Stripe Integration Setup Guide

This guide will help you integrate Stripe payment processing into your Rocketagents landing page.

## 🎯 What's Been Integrated

✅ **Stripe.js** - Added to HTML head
✅ **Pricing Buttons** - Updated to trigger Stripe Checkout
✅ **JavaScript Handler** - Created `stripe-checkout.js` with payment logic
✅ **Three Plans** - Starter ($9), Growth ($49), Professional ($199)

---

## 📋 Setup Steps

### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete business verification
3. Navigate to Dashboard

### 2. Create Products & Prices

In your Stripe Dashboard:

1. Go to **Products** → **Add Product**
2. Create three products:

#### Starter Plan
- **Name**: Starter Plan
- **Price**: $9/month
- **Recurring**: Monthly
- **Copy the Price ID** (starts with `price_...`)

#### Growth Plan
- **Name**: Growth Plan
- **Price**: $49/month
- **Recurring**: Monthly
- **Copy the Price ID**

#### Professional Plan
- **Name**: Professional Plan
- **Price**: $199/month
- **Recurring**: Monthly
- **Copy the Price ID**

### 3. Get API Keys

1. Go to **Developers** → **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_...` or `pk_live_...`)
3. Copy your **Secret Key** (starts with `sk_test_...` or `sk_live_...`)

⚠️ **Never commit your Secret Key to version control!**

### 4. Update Frontend Code

Edit `/src/script/stripe-checkout.js`:

```javascript
// Line 5: Replace with your Publishable Key
const stripe = Stripe('pk_test_YOUR_KEY_HERE');

// Lines 8-12: Replace with your actual Price IDs
const PRICE_IDS = {
    starter: 'price_1ABC...', // Your Starter Price ID
    growth: 'price_2DEF...', // Your Growth Price ID
    professional: 'price_3GHI...' // Your Professional Price ID
};
```

---

## 🔧 Backend Setup (Required)

You need a backend endpoint to create Stripe Checkout Sessions. Choose one option:

### Option A: Node.js/Express Backend

1. Install Stripe SDK:
```bash
npm install stripe express cors
```

2. Create `api/create-checkout-session.js`:

```javascript
const express = require('express');
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { priceId, plan } = req.body;

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: 'https://rocketagents.ai/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://rocketagents.ai/#pricing',
            customer_email: undefined, // Optional: pre-fill customer email
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

3. Start server:
```bash
node api/create-checkout-session.js
```

### Option B: Stripe Payment Links (No Backend!)

If you don't want to set up a backend, use Stripe Payment Links:

1. In Stripe Dashboard, go to **Payment Links**
2. Create payment links for each plan
3. Update `stripe-checkout.js`:

```javascript
// Uncomment the alternative handleCheckout function (lines 58-72)
async function handleCheckout(plan, priceId) {
    const PAYMENT_LINKS = {
        starter: 'https://buy.stripe.com/YOUR_STARTER_LINK',
        growth: 'https://buy.stripe.com/YOUR_GROWTH_LINK',
        professional: 'https://buy.stripe.com/YOUR_PROFESSIONAL_LINK'
    };

    const paymentLink = PAYMENT_LINKS[plan];
    if (paymentLink) {
        window.location.href = paymentLink;
    }
}
```

### Option C: Serverless Function (Vercel/Netlify)

#### Vercel Function (`api/create-checkout-session.js`):
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { priceId, plan } = req.body;

    const session = await stripe.checkout.sessions.create({
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/#pricing`,
    });

    res.json({ id: session.id });
};
```

Add `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
```

---

## ✅ Testing

### Test Mode
1. Use test API keys (`pk_test_...` and `sk_test_...`)
2. Use test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **3D Secure**: `4000 0027 6000 3184`
3. Use any future expiration date (e.g., 12/34)
4. Use any 3-digit CVC

### Go Live
1. Switch to live API keys (`pk_live_...` and `sk_live_...`)
2. Complete Stripe account verification
3. Test with real payment methods
4. Monitor payments in Stripe Dashboard

---

## 🔐 Security Best Practices

✅ **Never commit secret keys** - Use environment variables
✅ **Use HTTPS in production** - Required by Stripe
✅ **Validate webhooks** - Verify webhook signatures
✅ **Handle errors gracefully** - Show user-friendly messages
✅ **Test thoroughly** - Use Stripe test mode extensively

---

## 📊 Webhook Setup (Optional but Recommended)

To track subscription events (payment success, cancellation, etc.):

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/stripe-webhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. Create webhook handler:
```javascript
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = 'whsec_YOUR_WEBHOOK_SECRET';

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

        switch (event.type) {
            case 'checkout.session.completed':
                // Handle successful checkout
                const session = event.data.object;
                console.log('Payment successful:', session.id);
                break;
            case 'customer.subscription.deleted':
                // Handle subscription cancellation
                console.log('Subscription cancelled');
                break;
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});
```

---

## 🎨 Customization

### Success Page
Create `/success.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Payment Successful!</title>
</head>
<body>
    <h1>🎉 Welcome to Rocketagents!</h1>
    <p>Your subscription is now active.</p>
    <a href="https://app.rocketagents.ai/login">Go to Dashboard</a>
</body>
</html>
```

### Customize Checkout Appearance
In Stripe Dashboard → **Settings** → **Branding**:
- Upload logo
- Set brand colors
- Customize email templates

---

## 📚 Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/checkout)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Security Best Practices](https://stripe.com/docs/security)

---

## 🆘 Troubleshooting

### Error: "No API key provided"
- Make sure you've replaced `YOUR_STRIPE_PUBLISHABLE_KEY` in `stripe-checkout.js`

### Error: "Invalid Price ID"
- Verify Price IDs in Stripe Dashboard match those in `PRICE_IDS`

### Checkout not redirecting
- Check browser console for JavaScript errors
- Verify backend endpoint is running and accessible
- Test API endpoint with curl/Postman

### Payment not appearing in Stripe
- Make sure you're using correct API keys (test vs live)
- Check Stripe Dashboard → **Payments** for test transactions

---

**Last Updated**: 2026-01-16
**Version**: 1.0
**Status**: Integration Complete - Backend Setup Required

For support, contact: support@rocketagents.ai
