'use client';

import React, { useState } from 'react';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentDetailsSection from '@/components/checkout/PaymentDetailsSection';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '@/components/CartContext';

const stripePromise = loadStripe('YOUR_PUBLIC_KEY');

const CheckoutPage = () => {
  const {
    planName,
    finalPrice,
    billingType,
    applyCoupon,
    discount
  } = useCart();

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
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    country: '',
  });

  const subtotal = finalPrice ?? 0;
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  const handlePayNow = (billingDetails: {
  firstName: string;
  lastName: string;
}) => {
  console.log("Billing Details:", billingDetails);
  console.log("Cart Total:", total);

  // Stripe payment logic will go here
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4">
      <div className="w-full max-w-5xl bg-white overflow-hidden">
        <CheckoutHeader />

        <div className="grid grid-cols-2 gap-12 p-6">
          <div className="flex flex-col">
            <CheckoutForm
              formData={formData}
              onChange={(field, value) =>
                setFormData(prev => ({ ...prev, [field]: value }))
              }
            />
          </div>

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
                  alert("Only one discount can be applied per transaction.");
                  return;
                }

                applyCoupon(couponCode);
              }}
              discount={discount}
            />
          </div>
        </div>

        <div className="px-6 pb-6">
            <Elements stripe={stripePromise}>
              <PaymentDetailsSection
                formData={paymentData}
                onChange={(field, value) =>
                  setPaymentData(prev => ({ ...prev, [field]: value }))
                }
                billingDetails={{
                  firstName: formData.firstName,
                  lastName: formData.lastName
                }}
                onPayNow={handlePayNow} 
              />
            </Elements>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;