import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/ui/card';
import { Progress } from './ui/ui/progress';

interface UsageChartProps {
  title: string;
  data: Array<{
    label: string;
    total: number;
    used: number;
    usagePercent: number;
  }>;
  colorMapping: Record<string, string>;
}

export function UsageChart({ title, data, colorMapping }: UsageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {data.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">
                  {item.label === 'emea' ? 'EMEA' : 
                   item.label === 'americas' ? 'Americas' : 
                   item.label === 'asia-pacific' ? 'Asia-Pacific' : 
                   item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {item.used}/{item.total}
                  </span>
                  <span className="text-sm font-semibold">
                    {item.usagePercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            
              <Progress 
                value={Math.min(item.usagePercent, 100)} 
                className="h-3"
              />
            
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{item.total - item.used} unused</span>
                <span>{item.used} used</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
