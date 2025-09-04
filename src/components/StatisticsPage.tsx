import React from 'react';
import { BarChart3, TrendingUp, Users, Package, RefreshCw, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { usePromoCodeStats } from '../hooks/usePromoCodeStats';
import { StatCard } from './StatCard';
import { UsageChart } from './UsageChart';
import { Button } from './ui/ui/button';
import { Alert, AlertDescription } from './ui/ui/alert';

export function StatisticsPage() {
  const { regionStats, typeStats, overallStats, loading, error, refreshStats } = usePromoCodeStats();

  if (error) {
    return (
      <Alert variant="destructive">
        <BarChart3 className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold">Error Loading Statistics</p>
            <p>{error}</p>
            <Button onClick={refreshStats} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const regionColorMapping = {
    'emea': 'bg-blue-500',
    'americas': 'bg-orange-500',
    'asia-pacific': 'bg-teal-500'
  };

  const typeColorMapping = {
    'starter': 'bg-green-500',
    'standard': 'bg-purple-500'
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promo Code Statistics</h1>
          <p className="text-gray-600">Usage analytics and performance metrics</p>
        </div>
        <Button
          variant="outline"
          onClick={refreshStats}
          disabled={loading}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
          Refresh Data
        </Button>
      </div>

      {/* Overall Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Codes"
          value={overallStats.totalCodes}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Used Codes"
          value={overallStats.usedCodes}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Unused Codes"
          value={overallStats.unusedCodes}
          icon={Users}
          color="orange"
        />
        <StatCard
          title="Usage Rate"
          value={`${overallStats.overallUsagePercent.toFixed(1)}%`}
          icon={BarChart3}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UsageChart
          title="Usage by Region"
          data={regionStats.map(stat => ({
            label: stat.region,
            total: stat.total,
            used: stat.used,
            usagePercent: stat.usagePercent
          }))}
          colorMapping={regionColorMapping}
        />

        <UsageChart
          title="Usage by Type"
          data={typeStats.map(stat => ({
            label: stat.type,
            total: stat.total,
            used: stat.used,
            usagePercent: stat.usagePercent
          }))}
          colorMapping={typeColorMapping}
        />
      </div>

      {/* Detailed Statistics Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Region Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Regional Performance
          </h3>
          <div className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Used</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {regionStats.map((stat) => (
                  <tr key={stat.region} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">
                      {stat.region === 'emea' ? 'EMEA' : 
                       stat.region === 'americas' ? 'Americas' : 
                       'Asia-Pacific'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">{stat.total}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{stat.used}</td>
                    <td className="px-4 py-2 text-sm font-semibold text-gray-900">
                      {stat.usagePercent.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Type Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Type Performance
          </h3>
          <div className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Used</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {typeStats.map((stat) => (
                  <tr key={stat.type} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 capitalize">
                      {stat.type}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">{stat.total}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{stat.used}</td>
                    <td className="px-4 py-2 text-sm font-semibold text-gray-900">
                      {stat.usagePercent.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-700">Loading statistics...</span>
          </div>
        </div>
      )}
    </div>
  );
}
