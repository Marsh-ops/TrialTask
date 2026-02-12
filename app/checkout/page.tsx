'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentDetailsSection from '@/components/checkout/PaymentDetailsSection';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import toast, { Toaster } from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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

  const subtotal = price ?? 0;
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentSuccess = () => {
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
    router.push('/plans');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4">
      <Toaster position="top-right" />
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

        <div className="px-6 pb-6 mt-6">
          <Elements stripe={stripePromise}>
            <PaymentDetailsSection
              planName={planName ?? 'Premium Plan'}
              total={total}
              firstName={formData.firstName}
              lastName={formData.lastName}
              email={formData.email}
              companyName={formData.companyName}
              mobileNo={formData.mobileNo}
              businessAddress={formData.businessAddress}
              country={paymentData.country}
              onCountryChange={value => setPaymentData({ country: value })}
              onPayNow={handlePaymentSuccess}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;