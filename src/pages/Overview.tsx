import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingBag, Store } from 'lucide-react';
import { useMockDashboardData } from '../hooks/useMockData';

/**
 * Overview Page Component
 * @description The main dashboard view featuring a Bento Grid layout and Recharts visualizations.
 */
const Overview: React.FC = () => {
  const { data, isLoading } = useMockDashboardData();

  if (isLoading || !data) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-nova-blue border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-nova-muted text-sm font-medium tracking-widest">CONNECTING TO HQ...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-nova-text tracking-tight">Enterprise Overview</h1>
        <p className="text-nova-muted text-sm mt-1">Real-time telemetry across all Fufu Atelier locations.</p>
      </div>

      {/* Bento Grid Top: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Revenue */}
        <div className="bg-nova-surface border border-nova-border rounded-xl p-6 flex flex-col justify-between hover:border-nova-blue/50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-nova-muted text-sm font-medium mb-1">Total Revenue (30d)</p>
              <h3 className="text-3xl font-bold text-nova-text">${data.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-nova-blue/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-nova-blue" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-emerald-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+{data.revenueGrowth}% from last month</span>
          </div>
        </div>

        {/* KPI 2: Orders */}
        <div className="bg-nova-surface border border-nova-border rounded-xl p-6 flex flex-col justify-between hover:border-nova-blue/50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-nova-muted text-sm font-medium mb-1">Total Orders</p>
              <h3 className="text-3xl font-bold text-nova-text">{data.totalOrders.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="mt-4 text-sm text-nova-muted">Consistent volume across all nodes.</p>
        </div>

        {/* KPI 3: Active Stores */}
        <div className="bg-nova-surface border border-nova-border rounded-xl p-6 flex flex-col justify-between hover:border-nova-blue/50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-nova-muted text-sm font-medium mb-1">Active Hubs</p>
              <h3 className="text-3xl font-bold text-nova-text">{data.activeStores}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Store className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <p className="mt-4 text-sm text-nova-muted">London, Toronto, Waterloo.</p>
        </div>
      </div>

      {/* Bento Grid Bottom: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Revenue Trend (Spans 2 columns on large screens) */}
        <div className="bg-nova-surface border border-nova-border rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-nova-text mb-6">Revenue Telemetry</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007CED" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#007CED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#F9FAFB', borderRadius: '8px' }}
                  itemStyle={{ color: '#007CED' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#007CED" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Chart: Category Distribution */}
        <div className="bg-nova-surface border border-nova-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-nova-text mb-6">Product Matrix</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#F9FAFB', borderRadius: '8px', border: '1px solid #1F2937' }}
                  itemStyle={{ color: '#F9FAFB' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-nova-muted text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;