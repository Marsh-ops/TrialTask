'use client';
import React from 'react';
import { useCart } from '@/components/CartContext';

interface MembershipPlanDetailsProps {
  planName: string | null;
  price: number | null;
  billingType: 'monthly' | 'annual' | null;
}

const MembershipPlanDetails: React.FC<MembershipPlanDetailsProps> = ({
  planName,
  price,
  billingType,
}) => {

  const { discount } = useCart(); // <-- get discount from context

  const subtotal = price ?? 0;
  const totalAfterDiscount = subtotal - discount;

  return (
    <div className="px-6 py-4 mb-6">
      <div className="grid grid-cols-3 gap-4 items-start">
        {/* Plan name */}
        <div className="flex flex-col">
          <span className="font-semibold text-lg">
            {planName ?? 'No plan selected'}
          </span>
          <span className="text-gray-600 text-sm mt-1 italic">
            {billingType === 'annual'
              ? 'Annual Subscription'
              : 'Monthly Subscription'}
          </span>
        </div>

        {/* Dotted divider */}
        <div className="flex items-center justify-center">
          <div className="w-full border-t border-dotted border-gray-400 mt-6"></div>
        </div>

        {/* Price */}
        <div className="text-left ml-18 mt-4">
          <span className="text-gray-700 font-bold whitespace-nowrap">
            {price !== null ? `$${price.toFixed(2)}` : 'PRICE'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MembershipPlanDetails;