import { useState, useEffect } from 'react';
import { supabaseAdmin, PromoCode } from '../lib/supabase';

export function usePromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseAdmin
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch promo codes');
    } finally {
      setLoading(false);
    }
  };

  const addPromoCodes = async (
    codes: string[], 
    type: 'starter' | 'standard', 
    region: 'emea' | 'americas' | 'asia-pacific'
  ) => {
    try {
      const promoCodeData = codes.map(code => ({
        code: code.trim(),
        type,
        region,
        is_used: false
      }));

      const { error } = await supabaseAdmin
        .from('promo_codes')
        .insert(promoCodeData);

      if (error) throw error;
      await fetchPromoCodes();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to add promo codes' 
      };
    }
  };

  const deletePromoCode = async (id: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPromoCodes();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete promo code' 
      };
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  return {
    promoCodes,
    loading,
    error,
    addPromoCodes,
    deletePromoCode,
    refreshPromoCodes: fetchPromoCodes
  };
}
