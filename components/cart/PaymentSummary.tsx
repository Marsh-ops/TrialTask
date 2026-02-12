'use client';
import React from 'react';

interface PaymentSummaryProps {
  subtotal: string;
  gst: string;
  total: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ subtotal, gst, total }) => {
  return (
    <div className="px-6 py-4 space-y-3 border-t-4 border-gray-200 pt-10">
      <div className="grid grid-cols-3 gap-4 items-center">
        <span className="text-gray-700 font-bold">Payment Sub-Total</span>
        <div className="flex items-center">
          <div className="w-full border-t border-dotted border-gray-400"></div>
        </div>
        <div className="text-left ml-18">
          <span className="text-gray-700 font-bold whitespace-nowrap">{subtotal}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 items-center">
        <span className="text-gray-700 font-bold">GST</span>
        <div className="flex items-center">
          <div className="w-full border-t border-dotted border-gray-400"></div>
        </div>
        <div className="text-left ml-18">
          <span className="text-gray-700 font-bold whitespace-nowrap">{gst}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 items-center pt-2">
        <span className="text-gray-900 font-semibold text-lg">Total To Pay Today</span>
        <div className="flex items-center">
          <div className="w-full border-t border-dotted border-gray-400"></div>
        </div>
        <div className="text-left ml-18">
          <span className="text-gray-900 font-semibold text-lg whitespace-nowrap">{total}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;