'use client';
import React from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

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
  onCountryChange: (value: string) => void;
  onPayNow: () => void;
  loading?: boolean;
  setLoading?: (val: boolean) => void;
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
  loading,
  setLoading,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async () => {
    if (!stripe || !elements) return toast.error('Stripe not loaded yet');
    if (loading) return;

    setLoading?.(true);

    // Validate required fields
    const requiredFields = [
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
        toast.error(`Please fill in your ${field.label}`);
        setLoading?.(false);
        return;
      }
    }

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
      const clientSecret = data.clientSecret;
      if (!clientSecret) throw new Error('PaymentIntent not created');

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) throw new Error('Card details not entered');

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
        toast.error(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        onPayNow?.();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Payment error');
    }

    setLoading?.(false);
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Card + Country */}
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

      {/* CVC + Pay */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold">CVC</label>
        <div className="px-3 py-2 border rounded">
          <CardCvcElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
        <button
          disabled={loading}
          onClick={handlePay}
          className="w-full bg-[#002a25] text-white py-3 rounded mt-2 hover:bg-[#003d35] transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default PaymentDetailsSection;