'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';

interface AnalyticsDetailCardProps<T> {
  title: string;
  data: T[];
  categoryKey: keyof T;
  valueKey: keyof T;
  icon?: LucideIcon;
  iconMap?: Record<string, LucideIcon>;
}

export function AnalyticsDetailCard<T>({ title, data, categoryKey, valueKey, icon: DefaultIcon, iconMap }: AnalyticsDetailCardProps<T>) {

  const total = data.reduce((acc, item) => acc + (Number(item[valueKey]) || 0), 0);
  
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No data available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const category = String(item[categoryKey]);
            const value = Number(item[valueKey]);
            const percentage = total > 0 ? (value / total) * 100 : 0;
            const Icon = iconMap ? (iconMap[category] ?? DefaultIcon) : DefaultIcon;

            return (
              <div key={index} className="flex items-center">
                {Icon && <Icon className="h-4 w-4 mr-3 text-muted-foreground" />}
                <div className="flex-1 text-sm truncate">{category}</div>
                <div className="w-1/3 mx-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-medium">{value.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
