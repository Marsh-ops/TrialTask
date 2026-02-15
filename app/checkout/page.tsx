'use client';

import React, { useState } from 'react';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentDetailsSection from '@/components/checkout/PaymentDetailsSection';
import { Elements, useStripe, useElements, CardNumberElement, } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '@/components/CartContext';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe('pk_test_51HFvWoLue0GvB8uyReGdQz0zOjJoy5ovZNTkdqaSnK5zBwmi7x5fhtipu2kmfqAgHrDupYwwUVvHRR0pwiDLJ6KY00GqLrdcr7');

const CheckoutPageContent = () => {
  const { planName, finalPrice, billingType, discount, applyCoupon, clearCart } = useCart();
  const router = useRouter();

  const [couponCode, setCouponCode] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    businessAddress: '',
  });

  const [paymentData, setPaymentData] = useState({
    country: 'AU',
  });

  const stripe = useStripe();
  const elements = useElements();

  const subtotal = finalPrice ?? 0;
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  const handlePayNow = async () => {
    if (!stripe || !elements) return alert('Stripe not loaded');
    if (!planName || !billingType) return alert('No plan selected');

    try {
      // 1️⃣ Create PaymentIntent on backend
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: planName,
          billingType,
          totalAmount: total,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // 2️⃣ Get elements
      const cardNumber = elements.getElement(CardNumberElement);
      if (!cardNumber) throw new Error('Card element not found');

      // 3️⃣ Confirm Payment using Stripe Elements
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: { country: paymentData.country },
          },
        },
      });

      if (error) {
        alert(`Payment failed: ${error.message}`);
      } else if (paymentIntent?.status === 'succeeded') {
        clearCart();
        console.log('Payment succeeded, navigating to /plans');
        setTimeout(() => {
          router.push('/plans');
        }, 100); // 100ms ensures state update
      }
    } catch (err: any) {
      alert(`Payment error: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4">
      <div className="w-full max-w-5xl bg-white overflow-hidden">
        <CheckoutHeader />

        <div className="grid grid-cols-2 gap-12 p-6">
          {/* Checkout Form */}
          <div className="flex flex-col">
            <CheckoutForm
              formData={formData}
              onChange={(field, value) =>
                setFormData(prev => ({ ...prev, [field]: value }))
              }
            />
          </div>

          {/* Order Summary */}
          <div className="flex flex-col h-full">
            <OrderSummary
              planName={planName ?? 'No plan selected'}
              planPrice={`$${subtotal.toFixed(2)}`}
              subtotal={`$${subtotal.toFixed(2)}`}
              gst={`$${gst.toFixed(2)}`}
              total={`$${total.toFixed(2)}`}
              billingType={billingType}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              onApplyCoupon={() => {
                if (discount > 0) {
                  alert('Only one discount can be applied per transaction.');
                  return;
                }
                applyCoupon(couponCode);
              }}
              discount={discount}
            />
          </div>
        </div>

        {/* Payment Section */}
        <div className="px-6 pb-6">
          <PaymentDetailsSection
            formData={paymentData}
            onChange={(field, value) =>
              setPaymentData(prev => ({ ...prev, [field]: value }))
            }
            billingDetails={{
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
            }}
            onPayNow={handlePayNow}
          />
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutPageContent />
  </Elements>
);

export default CheckoutPage;