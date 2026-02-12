'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  planName: string | null;
  price: number | null;
  billingType: 'monthly' | 'annual' | null;
  setPlan: (name: string, price: number, billing: 'monthly' | 'annual') => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  discount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [planName, setPlanName] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [billingType, setBillingType] = useState<'monthly' | 'annual' | null>(null);
  const [discount, setDiscount] = useState(0);

  const setPlan = (name: string, selectedPrice: number, billing: 'monthly' | 'annual') => {
    setPlanName(name);
    setPrice(selectedPrice);
    setBillingType(billing);
    setDiscount(0); // reset discount when selecting a new plan
  };

  const clearCart = () => {
    setPlanName(null);
    setPrice(null);
    setBillingType(null);
    setDiscount(0);
  };

  const applyCoupon = (code: string) => {
    if (code.trim().toUpperCase() === 'SAVE10' && price) {
      setDiscount(price * 0.1);
      alert('Coupon applied: 10% off!');
    } else {
      setDiscount(0);
      alert('Invalid coupon code');
    }
  };

  return (
    <CartContext.Provider
      value={{ planName, price, billingType, setPlan, clearCart, applyCoupon, discount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};