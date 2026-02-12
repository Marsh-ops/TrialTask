'use client';
import React from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface PaymentDetailsSectionProps {
  planName: string;
  total: number;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  mobileNo: string;
  businessAddress: string;
  country: string;
  loading?: boolean;
  error?: string | null;
  onCountryChange: (value: string) => void;
  onPayNow: () => void; // optional callback after successful payment
}

const PaymentDetailsSection: React.FC<PaymentDetailsSectionProps> = ({
  planName,
  total,
  firstName,
  lastName,
  email,
  companyName,
  mobileNo,
  businessAddress,
  country,
  onCountryChange,
  onPayNow,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async () => {
    if (!stripe || !elements) {
      alert('Stripe has not loaded yet.');
      return;
    }

    // -------------------------
    // Step 0: Validate required fields BEFORE creating PaymentIntent
    // -------------------------
    const requiredFields: { label: string; value: string }[] = [
      { label: 'First Name', value: firstName },
      { label: 'Last Name', value: lastName },
      { label: 'Email', value: email },
      { label: 'Company Name', value: companyName },
      { label: 'Mobile No', value: mobileNo },
      { label: 'Business Address', value: businessAddress },
      { label: 'Country', value: country },
    ];

    for (const field of requiredFields) {
      if (!field.value.trim()) {
        alert(`Please fill in your ${field.label}`);
        return; // stop here if any field is empty
      }
    }

    // -------------------------
    // Step 1: Create PaymentIntent
    // -------------------------
    let clientSecret: string;
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

      if (!res.ok) {
        const text = await res.text();
        console.error('Server returned non-JSON response:', text);
        throw new Error('PaymentIntent creation failed');
      }

      const data = await res.json();
      clientSecret = data.clientSecret;
      if (!clientSecret) throw new Error('PaymentIntent not created');
    } catch (error: any) {
      console.error('Payment creation error:', error);
      alert(`Payment error: ${error.message || error}`);
      return;
    }

    // -------------------------
    // Step 2: Confirm payment
    // -------------------------
    try {
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) throw new Error('Card element not found');

      const result = await stripe.confirmCardPayment(clientSecret, {
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
        console.error('Stripe confirmCardPayment error:', result.error);
        alert(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent?.status === 'succeeded') {
        onPayNow?.(); // clear cart, form, or trigger post-payment actions
      }
    } catch (error: any) {
      console.error('Payment confirmation error:', error);
      alert(`Payment error: ${error.message || error}`);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Card Number + Country */}
      <div className="col-span-2 space-y-4">
        <label className="block text-sm font-semibold">Card Number</label>
        <div className="px-3 py-2 border rounded">
          <CardNumberElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>

        <label className="block text-sm font-semibold">Country</label>
        <input
          type="text"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {/* Expiry */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold">Expiry</label>
        <div className="px-3 py-2 border rounded">
          <CardExpiryElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
      </div>

      {/* CVC + Pay Now */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold">CVC</label>
        <div className="px-3 py-2 border rounded">
          <CardCvcElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
        <button
          onClick={handlePay}
          className="w-full bg-[#002a25] text-white py-3 rounded mt-2 hover:bg-[#003d35] transition-colors"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentDetailsSection;