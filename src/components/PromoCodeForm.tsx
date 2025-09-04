import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { VALID_TYPES, VALID_REGIONS } from '../lib/supabase';
import { Button } from './ui/ui/button';
import { Input } from './ui/ui/input';
import { Label } from './ui/ui/label';
import { Textarea } from './ui/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/ui/card';
import { Alert, AlertDescription } from './ui/ui/alert';

interface PromoCodeFormProps {
  onAddCodes: (codes: string[], type: 'starter' | 'standard', region: 'emea' | 'americas' | 'asia-pacific') => Promise<{ success: boolean; error?: string }>;
}

export function PromoCodeForm({ onAddCodes }: PromoCodeFormProps) {
  const [codes, setCodes] = useState('');
  const [type, setType] = useState<'starter' | 'standard'>('starter');
  const [region, setRegion] = useState<'emea' | 'americas' | 'asia-pacific'>('emea');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const codeLines = codes.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (codeLines.length === 0) {
      setMessage({ type: 'error', text: 'Please enter at least one promo code' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await onAddCodes(codeLines, type, region);

    if (result.success) {
      setCodes('');
      setMessage({ type: 'success', text: `Successfully added ${codeLines.length} promo code(s)` });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to add promo codes' });
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Promo Codes
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codes">Promo Codes (one per line)</Label>
            <Textarea
              id="codes"
              value={codes}
              onChange={(e) => setCodes(e.target.value)}
              rows={6}
              placeholder="Enter promo codes, one per line&#10;e.g.:&#10;PROMO001&#10;PROMO002&#10;PROMO003"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as 'starter' | 'standard')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {VALID_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select
                value={region}
                onValueChange={(value) => setRegion(value as 'emea' | 'americas' | 'asia-pacific')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {VALID_REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r === 'emea' ? 'EMEA' : r === 'americas' ? 'Americas' : 'Asia-Pacific'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Adding Codes...' : 'Add Promo Codes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
