import { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';

// --- OVERVIEW DASHBOARD TYPES ---
export interface SalesTrend {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategoryDistribution {
  name: string;
  value: number;
  color: string;
}

export interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  activeStores: number;
  revenueGrowth: number;
  salesTrend: SalesTrend[];
  categoryData: CategoryDistribution[];
}

// --- ORDER TABLE TYPES (NEW) ---
export type OrderStatus = 'Completed' | 'Processing' | 'Pending' | 'Cancelled';
export type StoreLocation = 'London HQ' | 'Toronto Hub' | 'Waterloo Node';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: OrderStatus;
  location: StoreLocation;
}

/**
 * Hook: useMockDashboardData
 * @description Generates data for the Overview dashboard.
 */
export const useMockDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trendData: SalesTrend[] = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return {
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: faker.number.int({ min: 1200, max: 4500 }),
          orders: faker.number.int({ min: 15, max: 60 }),
        };
      });

      const categories: CategoryDistribution[] = [
        { name: 'Signature Cakes', value: faker.number.int({ min: 400, max: 600 }), color: '#007CED' },
        { name: 'Custom Bespoke', value: faker.number.int({ min: 200, max: 300 }), color: '#8B5CF6' },
        { name: 'Pastries & Tarts', value: faker.number.int({ min: 150, max: 250 }), color: '#10B981' },
        { name: 'Beverages', value: faker.number.int({ min: 50, max: 100 }), color: '#F59E0B' },
      ];

      const payload: DashboardData = {
        totalRevenue: faker.number.int({ min: 125000, max: 150000 }),
        totalOrders: faker.number.int({ min: 1200, max: 1800 }),
        activeStores: 3,
        revenueGrowth: faker.number.float({ min: 2.5, max: 12.5, fractionDigits: 1 }),
        salesTrend: trendData,
        categoryData: categories,
      };

      setData(payload);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
};

/**
 * Hook: useMockOrders
 * @description Generates 500 realistic orders for the complex data table.
 */
export const useMockOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Removed the unused 'statuses' array completely to satisfy TypeScript strict mode
      const locations: StoreLocation[] = ['London HQ', 'Toronto Hub', 'Waterloo Node'];

      const generatedOrders: Order[] = Array.from({ length: 500 }).map(() => ({
        id: faker.string.alphanumeric(8).toUpperCase(),
        customerName: faker.person.fullName(),
        customerEmail: faker.internet.email().toLowerCase(),
        date: faker.date.recent({ days: 30 }).toISOString(),
        total: faker.number.float({ min: 25, max: 850, fractionDigits: 2 }),
        // Weighted random to make data look realistic
        status: faker.helpers.arrayElement([...Array(10).fill('Completed'), ...Array(5).fill('Processing'), ...Array(3).fill('Pending'), 'Cancelled']),
        location: faker.helpers.arrayElement(locations),
      }));

      // Sort by date descending initially
      generatedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setOrders(generatedOrders);
      setIsLoading(false);
    }, 600); // 600ms latency

    return () => clearTimeout(timer);
  }, []);

  return { orders, isLoading };
};