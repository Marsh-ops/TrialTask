// data/products.ts

export interface Product {
  id: number;
  name: string;
  monthlyPrice: number;
  totalMonthlyPrice: number;
  totalMonthlySavings: number;
  totalAnnualPrice: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Bronze Membership',
    monthlyPrice: 140,
    totalMonthlyPrice: 140 * 12, // 1680
    totalMonthlySavings: 1680 * 0.1, // 168
    totalAnnualPrice: 1680 - 168, // 1512
  },
  {
    id: 2,
    name: 'Silver Membership',
    monthlyPrice: 240,
    totalMonthlyPrice: 240 * 12, // 2880
    totalMonthlySavings: 2880 * 0.1, // 288
    totalAnnualPrice: 2880 - 288, // 2592
  },
  {
    id: 3,
    name: 'Gold Membership',
    monthlyPrice: 340,
    totalMonthlyPrice: 340 * 12, // 4080
    totalMonthlySavings: 4080 * 0.1, // 408
    totalAnnualPrice: 4080 - 408, // 3672
  },
];