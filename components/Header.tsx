'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from '@phosphor-icons/react';
import { useCart } from "@/components/CartContext";

const Header: React.FC = () => {
  const { planName, price, billingType } = useCart();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <header className="bg-[#002a25] text-white px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo/logo.png" alt="Logo" width={100} height={100} />
        </Link>

        {/* Navigation */}
        <nav className="flex-1 flex justify-center">
          <Link
            href="/plans"
            className="text-white hover:text-gray-200 font-semibold"
          >
            Membership Plans
          </Link>
        </nav>

        {/* Cart button */}
        <div className="flex items-center gap-2">
          <Link href="/cart">
            <button className="flex items-center gap-2 bg-white text-black py-2 px-4 rounded shadow hover:bg-gray-100 transition-colors">
              <ShoppingCart size={24} weight="bold" />
              {price !== null && planName && (
                <span>
                  {planName} – {billingType === 'annual' ? 'Annual' : 'Monthly'}: {formatCurrency(price)}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;