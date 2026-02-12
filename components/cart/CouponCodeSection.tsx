'use client';
import { useCart } from '@/components/CartContext';
import React, { useState } from 'react';

const CouponCodeSection: React.FC = () => {
  const [couponCode, setCouponCode] = useState('');
  const { applyCoupon } = useCart();

  const handleApply = () => {
    applyCoupon(couponCode);
  };

  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold text-lg whitespace-nowrap">Apply A Coupon Code</h2>
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#002a25] focus:border-transparent"
          />
          <button
            onClick={handleApply}
            className="bg-[#002a25] text-white px-6 py-2 rounded font-semibold hover:bg-[#003d35] transition-colors whitespace-nowrap"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponCodeSection;
