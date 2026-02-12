'use client';

import React, { useState } from 'react';
import { useCart } from '@/components/CartContext';
import MembershipHeader from '@/components/cart/MembershipHeader';
import MembershipPlanDetails from '@/components/cart/MembershipPlanDetails';
import PaymentSummary from '@/components/cart/PaymentSummary';
import TermsAndConditions from '@/components/cart/TermsAndConditions';
import CheckoutButton from '@/components/cart/CheckoutButton';
import CouponCodeSection from '@/components/cart/CouponCodeSection';

const CartPage = () => {
  const { planName, price, billingType } = useCart(); // <- include billingType
  const [termsAgreed, setTermsAgreed] = useState(false);

  const subtotal = price ?? 0;
  const gst = subtotal * 0.1; // Example 10% GST
  const total = subtotal + gst;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4">
      <div className="w-full max-w-4xl bg-white overflow-hidden">
        <MembershipHeader />
        <MembershipPlanDetails
          planName={planName}
          price={price}
          billingType={billingType} // <- now defined
        />
        {/* Coupon field */}
        <CouponCodeSection />

        <PaymentSummary
          subtotal={`$${subtotal.toFixed(2)}`}
          gst={`$${gst.toFixed(2)}`}
          total={`$${total.toFixed(2)}`}
        />
        <TermsAndConditions onAgreementChange={setTermsAgreed} />
        <CheckoutButton disabled={!termsAgreed} />
      </div>
    </div>
  );
};

export default CartPage;