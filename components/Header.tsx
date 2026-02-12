// Header.tsx
'use client';

import React from 'react';
import { CartProvider } from "@/components/CartContext";
import HeaderContent from "./HeaderContent";

const Header: React.FC = () => {
  return (
    <CartProvider>
      <HeaderContent />
    </CartProvider>
  );
};

export default Header;