import React from 'react';
import { usePromoCodes } from '../hooks/usePromoCodes';
import { PromoCodeForm } from './PromoCodeForm';
import { PromoCodeList } from './PromoCodeList';

export function ManagementPage() {
  const { promoCodes, loading, error, addPromoCodes, deletePromoCode, refreshPromoCodes } = usePromoCodes();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Promo Code Management</h1>
        <p className="text-gray-600">Add, remove, and manage promotional codes</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <PromoCodeForm onAddCodes={addPromoCodes} />
        </div>
        <div className="lg:col-span-2">
          <PromoCodeList
            promoCodes={promoCodes}
            loading={loading}
            onDeleteCode={deletePromoCode}
            onRefresh={refreshPromoCodes}
          />
        </div>
      </div>
    </div>
  );
}
