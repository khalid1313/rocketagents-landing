// Stripe Integration for Rocketagents Landing Page
// Stripe Publishable Key (Safe to use in frontend)

// Initialize Stripe with your publishable key
const stripe = Stripe('pk_live_51ReEC0Gm05v4tX1ZhJChdyREAi5p7JJ0n5i2f0hlNqnbUCReV5hWUuforlxBkvGhhraLv0FO4TDMzejqDWJLTCcV00lmY5FXZu');

// Price mapping - Update these with your actual Stripe Price IDs
const PRICE_IDS = {
    starter: 'price_starter_9', // Replace with actual Price ID from Stripe Dashboard
    growth: 'price_growth_49', // Replace with actual Price ID from Stripe Dashboard
    professional: 'price_professional_199' // Replace with actual Price ID from Stripe Dashboard
};

/**
 * Handle Stripe Checkout with Payment Links
 * @param {string} plan - The plan name (starter, growth, professional)
 * @param {string} priceId - Not used with Payment Links (kept for compatibility)
 */
async function handleCheckout(plan, priceId) {
    // Stripe Payment Links - Direct checkout (no backend needed)
    const PAYMENT_LINKS = {
        starter: 'https://buy.stripe.com/4gMcN59asdhM5Er0va24002',
        growth: 'https://buy.stripe.com/dRm00jbiAelQgj5b9O24001',
        professional: 'https://buy.stripe.com/14A7sLcmEdhM9UH6Ty24003'
    };

    const paymentLink = PAYMENT_LINKS[plan];

    // Track checkout event with Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
            'event_category': 'Pricing',
            'event_label': plan,
            'value': plan === 'starter' ? 9 : plan === 'growth' ? 49 : 199
        });
    }

    if (paymentLink) {
        // Redirect to Stripe Payment Link
        window.location.href = paymentLink;
    } else {
        alert('This plan is not available yet. Please contact sales at support@rocketagents.ai');
    }
}

// Payment links are now active!
// All pricing buttons will redirect to Stripe checkout pages
// No backend server needed - Payment Links handle everything
