import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { usePromoCodes } from '../hooks/usePromoCodes';
import { Button } from './ui/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/ui/table';
import { Badge } from './ui/ui/badge';
import { Label } from './ui/ui/label';
import { cn } from '../lib/utils';

export function UsedCodesPage() {
  const { promoCodes, loading, refreshPromoCodes } = usePromoCodes();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');

  const usedCodes = promoCodes
    .filter(code => code.is_used)
    .filter(code => {
      if (filterType !== 'all' && code.type !== filterType) return false;
      if (filterRegion !== 'all' && code.region !== filterRegion) return false;
      return true;
    })
    .sort((a, b) => {
      if (!a.redeem_date) return 1;
      if (!b.redeem_date) return -1;
      return new Date(b.redeem_date).getTime() - new Date(a.redeem_date).getTime();
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Used Promo Codes</h1>
          <p className="text-gray-600 mt-1">View all redeemed promo codes sorted by redemption date</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle>Used Codes ({usedCodes.length})</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshPromoCodes}
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
              <span className="text-muted-foreground">Loading used codes...</span>
            </div>
          ) : usedCodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No used codes found matching the current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Redeemed Date</TableHead>
                    <TableHead>Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usedCodes.map((code) => (
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
                      <TableCell className="text-sm">
                        {code.redeem_date ? (
                          <div>
                            <div className="font-medium text-gray-900">
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
