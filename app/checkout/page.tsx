'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

interface PaymentDetailsSectionProps {
  planName?: string;
  total?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  companyName?: string;
  mobileNo?: string;
  businessAddress?: string;
  country?: string;
  onCountryChange: (value: string) => void;
  onPayNow: () => void;
}

const PaymentDetailsSection: React.FC<PaymentDetailsSectionProps> = ({
  planName = 'No plan selected',
  total = 0,
  firstName = '',
  lastName = '',
  email = '',
  companyName = '',
  mobileNo = '',
  businessAddress = '',
  country = '',
  onCountryChange,
  onPayNow,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent SSR issues
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const requiredFields = useMemo(
    () => [
      { label: 'First Name', value: firstName },
      { label: 'Last Name', value: lastName },
      { label: 'Email', value: email },
      { label: 'Company Name', value: companyName },
      { label: 'Mobile No', value: mobileNo },
      { label: 'Business Address', value: businessAddress },
      { label: 'Country', value: country },
    ],
    [firstName, lastName, email, companyName, mobileNo, businessAddress, country]
  );

  const handlePay = async () => {
    if (!stripe || !elements) return toast.error('Stripe not loaded yet');

    // Validate required fields
    for (const field of requiredFields) {
      if (!field.value.trim()) {
        toast.error(`Please fill in your ${field.label}`);
        return;
      }
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: planName,
          billingType: 'Monthly',
          totalAmount: total,
        }),
      });

      const data = await res.json();
      if (!data.clientSecret) throw new Error(data.error || 'PaymentIntent not created');

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card details not entered');

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${firstName} ${lastName}`,
            email,
            address: { country },
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        toast.success('✅ Payment successful!');
        onPayNow();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Payment error');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold">Card Details</label>
      <div className="px-3 py-2 border rounded">
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>

      <label className="block text-sm font-semibold">Country</label>
      <input
        type="text"
        value={country}
        onChange={(e) => onCountryChange(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />

      <button
        onClick={handlePay}
        disabled={loading}
        aria-busy={loading}
        className="w-full bg-[#002a25] text-white py-3 rounded mt-2 hover:bg-[#003d35] transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentDetailsSection;