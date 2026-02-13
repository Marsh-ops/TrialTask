'use client';

import React, { useState } from 'react';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentDetailsSection from '@/components/checkout/PaymentDetailsSection';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '@/components/CartContext';

const stripePromise = loadStripe('pk_test_51HFvWoLue0GvB8uyReGdQz0zOjJoy5ovZNTkdqaSnK5zBwmi7x5fhtipu2kmfqAgHrDupYwwUVvHRR0pwiDLJ6KY00GqLrdcr7'); // your Stripe public key

const CheckoutPage = () => {
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

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePayNow = () => {
    // TODO: Implement payment processing
    console.log('Processing payment with:', { ...formData, ...paymentData });
  };

  const { planName, finalPrice, billingType } = useCart();

  // Assuming GST is 10% of subtotal
  const subtotal = finalPrice ?? 0;
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4">
      <div className="w-full max-w-5xl bg-white overflow-hidden">
        <CheckoutHeader />
        
        {/* Two Column Layout - Form and Order Summary */}
        <div className="grid grid-cols-2 gap-12 p-6">
          {/* Left Column - Personal Details Form */}
          <div className="flex flex-col">
            <CheckoutForm formData={formData} onChange={handleFormChange} />
          </div>

          {/* Right Column - Order Summary */}
          <div className="flex flex-col h-full">
            <OrderSummary
              planName={planName ?? 'No plan selected'}
              planPrice={`$${subtotal.toFixed(2)}`}
              subtotal={`$${subtotal.toFixed(2)}`}
              gst={`$${gst.toFixed(2)}`}
              total={`$${total.toFixed(2)}`}
              billingType={billingType}
            />
          </div>
        </div>

        {/* Full Width - Payment Details Section */}
        <div className="px-6 pb-6">
          <Elements stripe={stripePromise}>
            <PaymentDetailsSection
              formData={paymentData}
              onChange={handlePaymentChange}
              billingDetails={{ firstName: formData.firstName, lastName: formData.lastName }}
              onPayNow={handlePayNow}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;