import { useState, useEffect } from 'react';
import { supabaseAdmin } from '../lib/supabase';

export interface RegionStats {
  region: string;
  total: number;
  used: number;
  unused: number;
  usagePercent: number;
}

export interface TypeStats {
  type: string;
  total: number;
  used: number;
  unused: number;
  usagePercent: number;
}

export interface OverallStats {
  totalCodes: number;
  usedCodes: number;
  unusedCodes: number;
  overallUsagePercent: number;
}

export function usePromoCodeStats() {
  const [regionStats, setRegionStats] = useState<RegionStats[]>([]);
  const [typeStats, setTypeStats] = useState<TypeStats[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalCodes: 0,
    usedCodes: 0,
    unusedCodes: 0,
    overallUsagePercent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabaseAdmin
        .from('promo_codes')
        .select('type, region, is_used');

      if (error) throw error;

      const codes = data || [];

      // Calculate overall stats
      const totalCodes = codes.length;
      const usedCodes = codes.filter(code => code.is_used).length;
      const unusedCodes = totalCodes - usedCodes;
      const overallUsagePercent = totalCodes > 0 ? (usedCodes / totalCodes) * 100 : 0;

      setOverallStats({
        totalCodes,
        usedCodes,
        unusedCodes,
        overallUsagePercent
      });

      // Calculate region stats
      const regionGroups = codes.reduce((acc, code) => {
        if (!acc[code.region]) {
          acc[code.region] = { total: 0, used: 0 };
        }
        acc[code.region].total++;
        if (code.is_used) {
          acc[code.region].used++;
        }
        return acc;
      }, {} as Record<string, { total: number; used: number }>);

      const regionStatsArray = Object.entries(regionGroups).map(([region, stats]) => ({
        region,
        total: stats.total,
        used: stats.used,
        unused: stats.total - stats.used,
        usagePercent: stats.total > 0 ? (stats.used / stats.total) * 100 : 0
      }));

      setRegionStats(regionStatsArray);

      // Calculate type stats
      const typeGroups = codes.reduce((acc, code) => {
        if (!acc[code.type]) {
          acc[code.type] = { total: 0, used: 0 };
        }
        acc[code.type].total++;
        if (code.is_used) {
          acc[code.type].used++;
        }
        return acc;
      }, {} as Record<string, { total: number; used: number }>);

      const typeStatsArray = Object.entries(typeGroups).map(([type, stats]) => ({
        type,
        total: stats.total,
        used: stats.used,
        unused: stats.total - stats.used,
        usagePercent: stats.total > 0 ? (stats.used / stats.total) * 100 : 0
      }));

      setTypeStats(typeStatsArray);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    regionStats,
    typeStats,
    overallStats,
    loading,
    error,
    refreshStats: fetchStats
  };
}
