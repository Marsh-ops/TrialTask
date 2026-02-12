'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentDetailsSection from '@/components/checkout/PaymentDetailsSection';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  'pk_test_51HFvWoLue0GvB8uyReGdQz0zOjJoy5ovZNTkdqaSnK5zBwmi7x5fhtipu2kmfqAgHrDupYwwUVvHRR0pwiDLJ6KY00GqLrdcr7'
);

const CheckoutPage = () => {
  const router = useRouter();
  const { planName, price, clearCart } = useCart();

  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    businessAddress: '',
  });

  const [paymentData, setPaymentData] = useState({ country: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = price ?? 0;
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  const handleFormChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handlePaymentChange = (field: string, value: string) =>
    setPaymentData((prev) => ({ ...prev, [field]: value }));

  const handlePayNow = async () => {
    // --- Validate required fields ---
    const requiredFields = [
      'companyName',
      'firstName',
      'lastName',
      'email',
      'mobileNo',
      'businessAddress',
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        alert(`Please fill in your ${field.replace(/([A-Z])/g, ' $1')}`);
        return;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // --- 1️⃣ Create PaymentIntent on backend ---
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: planName,
          billingType: 'monthly',
          totalAmount: total,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      const clientSecret = data.clientSecret;

      // --- 2️⃣ Confirm card payment ---
      const elements = useElements();
      if (!elements) throw new Error('Stripe Elements not loaded');

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card details not entered');

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: { line1: formData.businessAddress },
          },
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message || 'Payment failed');
        setLoading(false);
        return;
      }

      if (paymentResult.paymentIntent?.status === 'succeeded') {
        // --- 3️⃣ Payment succeeded: clear cart and redirect ---
        clearCart();
        setFormData({
          companyName: '',
          firstName: '',
          lastName: '',
          email: '',
          mobileNo: '',
          businessAddress: '',
        });
        setPaymentData({ country: '' });

        router.push('/membership-plans'); // redirect
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong during payment');
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4">
      <div className="w-full max-w-5xl bg-white overflow-hidden">
        <CheckoutHeader />
        <div className="grid grid-cols-2 gap-12 p-6">
          <div className="flex flex-col">
            <CheckoutForm formData={formData} onChange={handleFormChange} />
          </div>
          <div className="flex flex-col h-full">
            <OrderSummary
              planName={planName ?? 'No plan selected'}
              planPrice={`$${(price ?? 0).toFixed(2)}`}
              subtotal={`$${subtotal.toFixed(2)}`}
              gst={`$${gst.toFixed(2)}`}
              total={`$${total.toFixed(2)}`}
            />
          </div>
        </div>
        <div className="px-6 pb-6">
          <Elements stripe={stripePromise}>
            <PaymentDetailsSection
              country={paymentData.country}
              onCountryChange={(value) =>
                setPaymentData((prev) => ({ ...prev, country: value }))
              }
              onPayNow={handlePayNow}
              loading={loading}
              error={error}
              planName={planName ?? 'No plan selected'}
              total={total}
              firstName={formData.firstName}
              lastName={formData.lastName}
              email={formData.email}
              companyName={formData.companyName}
              mobileNo={formData.mobileNo}
              businessAddress={formData.businessAddress}
            />
          </Elements>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;