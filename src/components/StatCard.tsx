import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/ui/card';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'teal';
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-50',
    green: 'bg-green-500 text-green-50', 
    purple: 'bg-purple-500 text-purple-50',
    orange: 'bg-orange-500 text-orange-50',
    teal: 'bg-teal-500 text-teal-50'
  };

  const iconClass = colorClasses[color];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={cn("p-3 rounded-lg", iconClass)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
