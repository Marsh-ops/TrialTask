'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentDetailsSection from '@/components/checkout/PaymentDetailsSection';
import { useCart } from '@/components/CartContext';

// Load Stripe with your public key (client-side)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutPage: React.FC = () => {
  const { planName, price } = useCart();
  const [country, setCountry] = useState('');

  const handlePaymentSuccess = () => {
    alert('Payment successful!');
    // Optional: clear cart, redirect to thank-you page, etc.
  };

  if (!planName || price === null) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">No plan selected</h2>
        <p>Please select a membership plan first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <Elements stripe={stripePromise}>
        <PaymentDetailsSection
          planName={planName}
          total={price}
          firstName=""
          lastName=""
          email=""
          companyName=""
          mobileNo=""
          businessAddress=""
          country={country}
          onCountryChange={setCountry}
          onPayNow={handlePaymentSuccess}
        />
      </Elements>
    </div>
  );
};

export default CheckoutPage;