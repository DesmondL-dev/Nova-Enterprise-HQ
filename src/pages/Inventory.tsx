import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Package, AlertCircle, X } from 'lucide-react';

/**
 * Zod Schema for Inventory Form Validation
 * @description Defines strict, type-safe validation rules for incoming stock.
 */
const inventorySchema = z.object({
  itemName: z.string().min(3, 'Item name must be at least 3 characters.'),
  batchId: z.string().regex(/^BATCH-\d{4}$/, 'Batch ID must follow format: BATCH-XXXX (e.g., BATCH-1024).'),
  quantity: z.number({ message: 'Quantity is required.' }).min(1, 'Must be at least 1.').max(10000, 'Exceeds maximum intake.'),
  supplier: z.string().min(2, 'Supplier name is required.'),
  expiryDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Expiry date must be in the future.',
  }),
});

/**
 * TypeScript type inferred directly from the Zod schema.
 */
type InventoryFormValues = z.infer<typeof inventorySchema>;

/**
 * Inventory Page Component
 * @description Manages supply chain stock with an ironclad validation form modal.
 */
const Inventory: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mockStock, setMockStock] = useState([
    { id: '1', name: 'Premium Cake Flour', batch: 'BATCH-0042', qty: 250, supplier: 'Ontario Mills', status: 'Healthy' },
    { id: '2', name: 'Madagascar Vanilla', batch: 'BATCH-0089', qty: 15, supplier: 'Global Spice Co', status: 'Low Stock' },
  ]);

  // --- REACT HOOK FORM SETUP ---
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    mode: 'onTouched', // Validates when the field loses focus
  });

  // --- HANDLERS ---
  const onSubmit = async (data: InventoryFormValues) => {
    // Simulate API Call Latency
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Add to mock local state
    setMockStock((prev) => [
      {
        id: Math.random().toString(),
        name: data.itemName,
        batch: data.batchId,
        qty: data.quantity,
        supplier: data.supplier,
        status: 'Healthy',
      },
      ...prev,
    ]);

    reset();
    setIsModalOpen(false);
  };

  const closeAndResetModal = () => {
    reset();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nova-text tracking-tight">Inventory Control</h1>
          <p className="text-nova-muted text-sm mt-1">
            Manage raw materials and track supply chain health.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-nova-blue hover:bg-nova-blue-hover px-4 py-2 rounded-md text-sm text-white font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stock Intake</span>
        </button>
      </div>

      {/* Simple Mock Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockStock.map((item) => (
          <div key={item.id} className="bg-nova-surface border border-nova-border rounded-xl p-5 hover:border-nova-blue/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-nova-bg rounded-lg border border-nova-border">
                <Package className="w-5 h-5 text-nova-blue" />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${item.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                {item.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-nova-text">{item.name}</h3>
            <p className="text-sm text-nova-muted font-mono mt-1">{item.batch}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-nova-muted">Qty: <span className="text-nova-text font-medium">{item.qty} units</span></span>
              <span className="text-nova-muted truncate max-w-[100px]">{item.supplier}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL OVERLAY (The Ironclad Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-nova-bg/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-nova-surface border border-nova-border w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-nova-border">
              <h2 className="text-lg font-bold text-nova-text">Register New Stock</h2>
              <button onClick={closeAndResetModal} className="text-nova-muted hover:text-nova-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-5">
              
              {/* Field: Item Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-nova-text block">Item Name</label>
                <input 
                  {...register('itemName')} 
                  className={`w-full bg-nova-bg border ${errors.itemName ? 'border-red-500/50 focus:border-red-500' : 'border-nova-border focus:border-nova-blue'} text-nova-text text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-nova-blue transition-all`}
                  placeholder="e.g., Organic Butter"
                />
                {errors.itemName && (
                  <p className="text-red-400 text-xs flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" />{errors.itemName.message}</p>
                )}
              </div>

              {/* Grid for Batch and Quantity */}
              <div className="grid grid-cols-2 gap-4">
                {/* Field: Batch ID */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-nova-text block">Batch ID</label>
                  <input 
                    {...register('batchId')} 
                    className={`w-full bg-nova-bg border ${errors.batchId ? 'border-red-500/50' : 'border-nova-border focus:border-nova-blue'} text-nova-text text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 transition-all uppercase`}
                    placeholder="BATCH-XXXX"
                  />
                  {errors.batchId && (
                    <p className="text-red-400 text-xs flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" />{errors.batchId.message}</p>
                  )}
                </div>

                {/* Field: Quantity */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-nova-text block">Quantity</label>
                  <input 
                    type="number"
                    {...register('quantity', { valueAsNumber: true })} 
                    className={`w-full bg-nova-bg border ${errors.quantity ? 'border-red-500/50' : 'border-nova-border focus:border-nova-blue'} text-nova-text text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 transition-all`}
                    placeholder="0"
                  />
                  {errors.quantity && (
                    <p className="text-red-400 text-xs flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" />{errors.quantity.message}</p>
                  )}
                </div>
              </div>

              {/* Field: Supplier */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-nova-text block">Supplier</label>
                <input 
                  {...register('supplier')} 
                  className={`w-full bg-nova-bg border ${errors.supplier ? 'border-red-500/50' : 'border-nova-border focus:border-nova-blue'} text-nova-text text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 transition-all`}
                  placeholder="Supplier Company Name"
                />
                {errors.supplier && (
                  <p className="text-red-400 text-xs flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" />{errors.supplier.message}</p>
                )}
              </div>

              {/* Field: Expiry Date */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-nova-text block">Expiry Date</label>
                <input 
                  type="date"
                  {...register('expiryDate')} 
                  className={`w-full bg-nova-bg border ${errors.expiryDate ? 'border-red-500/50' : 'border-nova-border focus:border-nova-blue'} text-nova-text text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 transition-all cursor-pointer`}
                />
                {errors.expiryDate && (
                  <p className="text-red-400 text-xs flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" />{errors.expiryDate.message}</p>
                )}
              </div>

              {/* Submit Actions */}
              <div className="pt-4 mt-2 border-t border-nova-border flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={closeAndResetModal}
                  className="px-4 py-2 text-sm font-medium text-nova-text bg-nova-bg border border-nova-border rounded-md hover:bg-nova-border transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-nova-blue rounded-md hover:bg-nova-blue-hover transition-colors disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> Saving...</>
                  ) : (
                    'Confirm Intake'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;