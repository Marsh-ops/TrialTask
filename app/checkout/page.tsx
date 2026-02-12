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
  const [loading, setLoading] = useState(false);

  const subtotal = price ?? 0;
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    toast.success('✅ Payment successful!');
    router.push('/plans'); // redirect to plans page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-5xl bg-white overflow-hidden">
        <CheckoutHeader />

        <div className="grid grid-cols-2 gap-12 p-6">
          {/* LEFT: Customer Form */}
          <div className="flex flex-col">
            <CheckoutForm formData={formData} onChange={handleFormChange} />
          </div>

          {/* RIGHT: Order Summary */}
          {/* <div className="flex flex-col h-full">
            <OrderSummary
              planName={planName ?? 'No plan selected'}
              planPrice={`$${(price ?? 0).toFixed(2)}`}
              subtotal={`$${subtotal.toFixed(2)}`}
              gst={`$${gst.toFixed(2)}`}
              total={`$${total.toFixed(2)}`}
            />
          </div>
        </div>

        {/* Payment Section */}
        {/* <div className="px-6 pb-6">
          <Elements stripe={stripePromise}>
            <PaymentDetailsSection
              planName={planName ?? 'No plan selected'}
              total={total}
              firstName={formData.firstName}
              lastName={formData.lastName}
              email={formData.email}
              companyName={formData.companyName}
              mobileNo={formData.mobileNo}
              businessAddress={formData.businessAddress}
              country={paymentData.country}
              onCountryChange={(value) =>
                setPaymentData((prev) => ({ ...prev, country: value }))
              }
              onPayNow={handlePaymentSuccess}
              loading={loading}
              setLoading={setLoading}
            />
          </Elements>
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;