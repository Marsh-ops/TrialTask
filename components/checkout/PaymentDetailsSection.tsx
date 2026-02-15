'use client';

import React from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useCart } from '@/components/CartContext';

interface PaymentDetailsSectionProps {
  formData: {
    country: string;
  };
  onChange: (field: string, value: string) => void;
  billingDetails: { firstName: string; lastName: string; email: string };
  onPayNow: () => void;
}

const PaymentDetailsSection: React.FC<PaymentDetailsSectionProps> = ({
  formData,
  onChange,
  billingDetails,
  onPayNow,
}) => {
  const { planName, billingType, finalPrice } = useCart();
  const stripe = useStripe();
  const elements = useElements();

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Column 1: Card Number and Country */}
      <div className="col-span-2 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Card Number
          </label>
          <div className="px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#002a25]">
            <CardNumberElement
              options={{
                style: {
                  base: { fontSize: '16px', color: '#000', '::placeholder': { color: '#a0a0a0' } },
                  invalid: { color: '#ff0000' },
                },
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Country
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => onChange('country', e.target.value)}
            placeholder="AU"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002a25] focus:border-transparent"
          />
        </div>
      </div>

      {/* Column 2: Expiry Date + Disclaimer */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Expiry Date
          </label>
          <div className="px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#002a25]">
            <CardExpiryElement
              options={{
                style: {
                  base: { fontSize: '16px', color: '#000', '::placeholder': { color: '#a0a0a0' } },
                  invalid: { color: '#ff0000' },
                },
              }}
            />
          </div>
        </div>
        <p className="text-xs text-gray-600 italic">
          By providing your card information, you allow Anderson Wembley Lawyers to charge your card for future payments in accordance with their terms.
        </p>
      </div>

      {/* Column 3: Security Code + Pay Now */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Security Code
          </label>
          <div className="px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#002a25]">
            <CardCvcElement
              options={{
                style: {
                  base: { fontSize: '16px', color: '#000', '::placeholder': { color: '#a0a0a0' } },
                  invalid: { color: '#ff0000' },
                },
              }}
            />
          </div>
        </div>

        <button
          onClick={onPayNow}
          className="w-full bg-[#002a25] text-white py-3 rounded-lg font-semibold hover:bg-[#003d35] transition-colors"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentDetailsSection;