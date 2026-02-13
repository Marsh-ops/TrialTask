'use client';

import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/components/CartContext';

interface PaymentDetailsSectionProps {
  formData: {
    cardNumber: string;
    expiryDate: string;
    securityCode: string;
    country: string;
  };
  onChange: (field: string, value: string) => void;
  onPayNow: (billingDetails: { firstName: string; lastName: string }) => void;
  billingDetails: { firstName: string; lastName: string }; 
}

const PaymentDetailsSection: React.FC<PaymentDetailsSectionProps> = ({
  formData,
  onChange,
  billingDetails,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { planName, billingType, finalPrice, clearCart } = useCart();

  // --- Input formatting functions ---
  const handleCardNumberChange = (value: string) => {
    let v = value.replace(/\D/g, '');          // only digits
    v = v.slice(0, 16);                        // max 16 digits
    const formatted = v.replace(/(\d{4})(?=\d)/g, '$1 '); // insert spaces
    onChange('cardNumber', formatted);
  };

  const handleExpiryChange = (value: string) => {
    let v = value.replace(/\D/g, '');          // only digits
    v = v.slice(0, 4);                         // max 4 digits
    if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`; // insert /
    onChange('expiryDate', v);
  };

  const handleCvcChange = (value: string) => {
    let v = value.replace(/\D/g, '');          // only digits
    v = v.slice(0, 4);                         // max 4 digits
    onChange('securityCode', v);
  };

  const handlePayNow = async () => {
  if (!stripe || !elements) return;

  if (!planName || !billingType || finalPrice === null) {
    alert('No plan selected');
    return;
  }

    try {
      // 1️⃣ Create PaymentIntent on backend
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: planName,
          billingType,
          totalAmount: finalPrice,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // 2️⃣ Confirm payment with Stripe using the hidden CardElement
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('CardElement not found');

      const paymentResult = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${billingDetails.firstName} ${billingDetails.lastName}`,
          },
        },
      });

      if (paymentResult.error) {
        alert(`Payment failed: ${paymentResult.error.message}`);
        console.error(paymentResult.error);
      } else if (paymentResult.paymentIntent?.status === 'succeeded') {
        alert('Payment successful!');
        clearCart();
      }
    } catch (err: any) {
      alert(`Payment error: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Column 1 (50% width): Card Number and Country */}
      <div className="col-span-2 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Card Number
          </label>
          <input
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleCardNumberChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002a25] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Country (i.e. AU, US, NZ etc)
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => onChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002a25] focus:border-transparent"
          />
        </div>
      </div>

      {/* Column 2 (25% width): Expiry Date and Disclaimer */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            value={formData.expiryDate}
            onChange={(e) => handleExpiryChange(e.target.value)}
            placeholder="MM/YY"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002a25] focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-600 italic">
          By providing your card information, you allow Anderson Wembley Lawyers to charge your card for future payments in accordance with their terms.
        </p>
      </div>

      {/* Column 3 (25% width): Security Code and Pay Now */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Security Code
          </label>
          <input
            type="text"
            value={formData.securityCode}
            onChange={(e) => handleCvcChange(e.target.value)}
            placeholder="CVV"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002a25] focus:border-transparent"
          />
        </div>

        {/* Hidden Stripe CardElement for secure payment */}
        <div className="hidden">
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>

        <button
          onClick={handlePayNow}
          className="w-full bg-[#002a25] text-white py-3 rounded-lg font-semibold hover:bg-[#003d35] transition-colors"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentDetailsSection;