import React, { useState, useMemo } from 'react';
import { useMockOrders, type Order, type OrderStatus, type StoreLocation } from '../hooks/useMockData';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';

/**
 * Orders Page Component
 * @description Enterprise data table with complex client-side filtering, sorting, and pagination.
 */
const Orders: React.FC = () => {
  const { orders, isLoading } = useMockOrders();

  // --- COMPONENT STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<StoreLocation | 'All'>('All');
  
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // --- CORE ENGINE: FILTERING & SORTING (useMemo for performance) ---
  const processedOrders = useMemo(() => {
    let result = [...orders];

    // 1. Apply Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(lowerSearch) ||
          order.customerName.toLowerCase().includes(lowerSearch) ||
          order.customerEmail.toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Apply Status Filter
    if (statusFilter !== 'All') {
      result = result.filter((order) => order.status === statusFilter);
    }

    // 3. Apply Location Filter
    if (locationFilter !== 'All') {
      result = result.filter((order) => order.location === locationFilter);
    }

    // 4. Apply Sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [orders, searchTerm, statusFilter, locationFilter, sortConfig]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(processedOrders.length / itemsPerPage);
  const currentOrders = processedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- HANDLERS ---
  const handleSort = (key: keyof Order) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Processing': return 'bg-nova-blue/10 text-nova-blue border-nova-blue/20';
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  // --- RENDER ---
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-nova-blue border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-nova-muted text-sm font-medium tracking-widest">FETCHING ORDER MATRIX...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nova-text tracking-tight">Order Management</h1>
          <p className="text-nova-muted text-sm mt-1">
            Displaying {processedOrders.length} records from HQ database.
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-nova-surface border border-nova-border px-4 py-2 rounded-md text-sm text-nova-text hover:bg-nova-border transition-colors">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Control Panel (Filters & Search) */}
      <div className="bg-nova-surface border border-nova-border rounded-xl p-4 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-muted" />
          <input
            type="text"
            placeholder="Search by ID, Customer, or Email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); handleFilterChange(); }}
            className="w-full bg-nova-bg border border-nova-border text-nova-text text-sm rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-nova-blue transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-nova-muted" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as OrderStatus | 'All'); handleFilterChange(); }}
            className="bg-nova-bg border border-nova-border text-nova-text text-sm rounded-md px-3 py-2 focus:outline-none focus:border-nova-blue transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Location Filter */}
        <div className="flex items-center space-x-2">
          <Store className="w-4 h-4 text-nova-muted" />
          <select
            value={locationFilter}
            onChange={(e) => { setLocationFilter(e.target.value as StoreLocation | 'All'); handleFilterChange(); }}
            className="bg-nova-bg border border-nova-border text-nova-text text-sm rounded-md px-3 py-2 focus:outline-none focus:border-nova-blue transition-all"
          >
            <option value="All">All Locations</option>
            <option value="London HQ">London HQ</option>
            <option value="Toronto Hub">Toronto Hub</option>
            <option value="Waterloo Node">Waterloo Node</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-nova-surface border border-nova-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-nova-text">
            <thead className="bg-nova-bg/50 border-b border-nova-border uppercase text-xs text-nova-muted font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-nova-blue transition-colors" onClick={() => handleSort('id')}>
                  <div className="flex items-center space-x-1">
                    <span>Order ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 cursor-pointer hover:text-nova-blue transition-colors" onClick={() => handleSort('location')}>
                  <div className="flex items-center space-x-1">
                    <span>Hub</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-nova-blue transition-colors" onClick={() => handleSort('date')}>
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-nova-blue transition-colors" onClick={() => handleSort('total')}>
                  <div className="flex items-center space-x-1">
                    <span>Total</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nova-border">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-nova-bg/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-nova-blue">#{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-nova-text">{order.customerName}</div>
                      <div className="text-xs text-nova-muted">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-nova-muted">{order.location}</td>
                    <td className="px-6 py-4 text-nova-muted">
                      {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-nova-text">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-nova-muted">
                    No orders found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-nova-surface border-t border-nova-border px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-nova-muted">
            Showing <span className="font-medium text-nova-text">{processedOrders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-medium text-nova-text">{Math.min(currentPage * itemsPerPage, processedOrders.length)}</span> of <span className="font-medium text-nova-text">{processedOrders.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md text-nova-muted hover:bg-nova-border hover:text-nova-text disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-sm font-medium text-nova-text px-2">
              Page {currentPage} of {totalPages || 1}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 rounded-md text-nova-muted hover:bg-nova-border hover:text-nova-text disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick fix for missing lucide-react icon inside this component
import { Store } from 'lucide-react';

export default Orders;