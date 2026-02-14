'use client';

import React from 'react';

interface OrderSummaryProps {
  planName: string;
  planPrice: string;
  subtotal: string;
  gst: string;
  total: string;
  billingType: 'monthly' | 'annual' | null;

  couponCode: string;
  setCouponCode: (value: string) => void;
  onApplyCoupon: () => void;
  discount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  planName,
  planPrice,
  subtotal,
  gst,
  total,
  billingType,
  couponCode,
  setCouponCode,
  onApplyCoupon,
  discount,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Plan Details */}
      <div className="grid grid-cols-3 gap-2 items-start mb-6 mt-6">
        <div className="flex flex-col">
          <span className="font-semibold">{planName}</span>
          <span className="text-gray-600 text-sm">
            {billingType === 'annual' ? 'Annual Subscription' : 'Monthly Subscription'}
          </span>
        </div>

        <div className="flex items-center pt-2">
          <div className="w-full border-t border-dotted border-gray-400 mt-3"></div>
        </div>

        <div className="text-right mt-3">
          <span className="text-gray-700 font-bold">{planPrice}</span>
        </div>
      </div>

      {/* Coupon Section */}
      <div className="grid grid-cols-3 gap-2 items-center mt-4">
        <div className="col-span-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002a25] focus:border-transparent"
          />
        </div>
        <div>
          <button
            onClick={onApplyCoupon}
            className="w-full bg-[#002a25] text-white py-2 rounded-lg font-semibold hover:bg-[#003d35] transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="flex-1 flex flex-col justify-center space-y-6 py-8 border-t-4 border-gray-200 border-b-4 border-gray-200 mt-6">
        <div className="grid grid-cols-3 gap-2 items-center">
          <span className="text-gray-700 font-bold">Payment Sub-Total</span>
          <div className="flex items-center">
            <div className="w-full border-t border-dotted border-gray-400"></div>
          </div>
          <div className="text-right">
            <span className="text-gray-700 font-bold">{subtotal}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 items-center">
          <span className="text-gray-700 font-bold">GST</span>
          <div className="flex items-center">
            <div className="w-full border-t border-dotted border-gray-400"></div>
          </div>
          <div className="text-right">
            <span className="text-gray-700 font-bold">{gst}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 items-center">
          <span className="text-gray-900 font-semibold">Total To Pay Today</span>
          <div className="flex items-center">
            <div className="w-full border-t border-dotted border-gray-400"></div>
          </div>
          <div className="text-right">
            <span className="text-gray-900 font-semibold">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;