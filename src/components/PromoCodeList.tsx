import React, { useState } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import { PromoCode } from '../lib/supabase';
import { Button } from './ui/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/ui/table';
import { Badge } from './ui/ui/badge';
import { Label } from './ui/ui/label';
import { cn } from '../lib/utils';

interface PromoCodeListProps {
  promoCodes: PromoCode[];
  loading: boolean;
  onDeleteCode: (id: string) => Promise<{ success: boolean; error?: string }>;
  onRefresh: () => void;
}

export function PromoCodeList({ promoCodes, loading, onDeleteCode, onRefresh }: PromoCodeListProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const baseFilteredCodes = promoCodes.filter(code => {
    if (filterType !== 'all' && code.type !== filterType) return false;
    if (filterRegion !== 'all' && code.region !== filterRegion) return false;
    return true;
  });

  const unusedCodes = baseFilteredCodes.filter(code => !code.is_used);
  const usedCodes = baseFilteredCodes.filter(code => code.is_used);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    
    setDeleteLoading(id);
    await onDeleteCode(id);
    setDeleteLoading(null);
  };

  const getTypeBadgeColor = (type: string) => {
    return type === 'starter' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-purple-100 text-purple-800';
  };

  const getRegionBadgeColor = (region: string) => {
    switch (region) {
      case 'emea': return 'bg-blue-100 text-blue-800';
      case 'americas': return 'bg-orange-100 text-orange-800';
      case 'asia-pacific': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsedBadgeColor = (isUsed: boolean) => {
    return isUsed 
      ? 'bg-red-100 text-red-800' 
      : 'bg-green-100 text-green-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>Promo Codes ({baseFilteredCodes.length})</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-1", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Region</Label>
            <Select
              value={filterRegion}
              onValueChange={setFilterRegion}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="emea">EMEA</SelectItem>
                <SelectItem value="americas">Americas</SelectItem>
                <SelectItem value="asia-pacific">Asia-Pacific</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-primary mr-2" />
            <span className="text-muted-foreground">Loading promo codes...</span>
          </div>
        ) : baseFilteredCodes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No promo codes found matching the current filters.
          </div>
        ) : (
          <div className="space-y-8">
            {/* Unused Codes Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Unused Codes ({unusedCodes.length})
              </h3>
              {unusedCodes.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground bg-gray-50 rounded-lg">
                  No unused codes found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unusedCodes.map((code) => (
                        <TableRow key={code.id}>
                          <TableCell>
                            <span className="font-mono text-sm">{code.code}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={code.type === 'starter' ? 'default' : 'secondary'}>
                              {code.type.charAt(0).toUpperCase() + code.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {code.region === 'emea' ? 'EMEA' : code.region === 'americas' ? 'Americas' : 'Asia-Pacific'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(code.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(code.id)}
                              disabled={deleteLoading === code.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            {/* Used Codes Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Used Codes ({usedCodes.length})
              </h3>
              {usedCodes.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground bg-gray-50 rounded-lg">
                  No used codes found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Redeemed</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usedCodes
                        .sort((a, b) => {
                          if (!a.redeem_date) return 1;
                          if (!b.redeem_date) return -1;
                          return new Date(b.redeem_date).getTime() - new Date(a.redeem_date).getTime();
                        })
                        .map((code) => (
                        <TableRow key={code.id} className="opacity-75">
                          <TableCell>
                            <span className="font-mono text-sm line-through text-muted-foreground">{code.code}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {code.type.charAt(0).toUpperCase() + code.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {code.region === 'emea' ? 'EMEA' : code.region === 'americas' ? 'Americas' : 'Asia-Pacific'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {code.redeem_date ? (
                              <div>
                                <div className="font-medium text-gray-700">
                                  {new Date(code.redeem_date).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(code.redeem_date).toLocaleTimeString()}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(code.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(code.id)}
                              disabled={deleteLoading === code.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
