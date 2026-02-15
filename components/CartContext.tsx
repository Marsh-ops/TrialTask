'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import toast from 'react-hot-toast';

interface CartContextType {
  planName: string | null;
  price: number | null;               // original price
  billingType: 'monthly' | 'annual' | null;
  setPlan: (name: string, price: number, billing: 'monthly' | 'annual') => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  discount: number;                   // absolute discount value
  finalPrice: number | null;          // price after discount
  paymentSuccess: boolean;                 // ✅ new
  setPaymentSuccess: React.Dispatch<React.SetStateAction<boolean>>; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [planName, setPlanName] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [billingType, setBillingType] = useState<'monthly' | 'annual' | null>(null);
  const [discount, setDiscount] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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
    if (!price) return;

    const normalizedCode = code.trim().toUpperCase();

    switch (normalizedCode) {
      case 'SAVE10':
        setDiscount(price * 0.1); // 10% off
        toast.success('Coupon applied: 10% off!');
        break;
      default:
        setDiscount(0);
        toast.error('Invalid coupon code');
    }
  };

  // Compute final price after discount
  const finalPrice = useMemo(() => {
    if (price === null) return null;
    return Math.max(price - discount, 0);
  }, [price, discount]);

  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({ planName, price, billingType, setPlan, clearCart, applyCoupon, discount, finalPrice, paymentSuccess, setPaymentSuccess, }),
    [planName, price, billingType, discount, finalPrice, paymentSuccess, setPaymentSuccess,]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};