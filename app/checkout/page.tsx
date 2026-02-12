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
import toast, { Toaster } from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutFormWrapper = ({
  total,
  formData,
  paymentData,
  setPaymentData,
  clearCart,
  handlePaymentSuccess
}: {
  total: number;
  formData: any;
  paymentData: any;
  setPaymentData: React.Dispatch<React.SetStateAction<{ country: string }>>; // <-- fixed
  clearCart: () => void;
  handlePaymentSuccess: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayNow = async () => {
    if (!stripe || !elements) {
      toast.error('Stripe not loaded yet.');
      return;
    }

    setLoading(true);

    try {
      // 1. Request a PaymentIntent from your backend
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Premium Plan', // adjust dynamically
          billingType: 'monthly',      // adjust dynamically
          totalAmount: total,
        }),
      });

      const data = await res.json();
      console.log('API response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      const clientSecret = data.clientSecret;
      if (!clientSecret) throw new Error('No client secret returned from API');

      // 2. Get the card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      console.log('ClientSecret:', clientSecret);
      console.log('CardElement:', cardElement);

      // 3. Confirm the payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: { country: paymentData.country } // <-- added country here
          },
        },
      });

      if (error) {
        console.error('Stripe confirmCardPayment error:', error);
        toast.error(error.message ?? 'An unexpected error occurred');
      } else {
        console.log('PaymentIntent confirmed:', paymentIntent);
        toast.success('✅ Payment successful!');
        handlePaymentSuccess();
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentDetailsSection
      planName="Premium Plan"
      total={total}
      firstName={formData.firstName}
      lastName={formData.lastName}
      email={formData.email}
      companyName={formData.companyName}
      mobileNo={formData.mobileNo}
      businessAddress={formData.businessAddress}
      country={paymentData.country}
      onCountryChange={(value) =>
        setPaymentData(prev => ({ ...prev, country: value })) // <-- works now
      }
      onPayNow={handlePayNow}
      loading={loading}
      setLoading={setLoading}
    />
  );
};

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
        <div className="px-6 pb-6">
          <Elements stripe={stripePromise}>
            <CheckoutFormWrapper
              total={total}
              formData={formData}
              paymentData={paymentData}
              setPaymentData={setPaymentData} 
              clearCart={clearCart}
              handlePaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;