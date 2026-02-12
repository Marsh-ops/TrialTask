'use client';
import React from 'react';
import Link from 'next/link';

interface CheckoutButtonProps {
  disabled?: boolean;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ disabled = false }) => {
  return (
    <div className="px-6 pb-6 max-w-xs mt-4">
      <Link
        href="/checkout"
        className={`block w-full bg-[#002a25] text-white text-center py-4 rounded-lg font-semibold transition-colors ${
          disabled
            ? 'opacity-50 cursor-not-allowed pointer-events-none'
            : 'hover:bg-[#003d35]'
        }`}
      >
        Proceed To Checkout
      </Link>
    </div>
  );
};

export default CheckoutButton;
