
'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe, Computer, Tablet, Smartphone, HelpCircle } from 'lucide-react';
import Image from 'next/image';

const iconMap: { [key: string]: React.FC<any> } = {
  // Browsers
  'Chrome': () => <Image src="https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/chrome/chrome_48x48.png" alt="Chrome" width={16} height={16} />,
  'Firefox': () => <Image src="https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/firefox/firefox_48x48.png" alt="Firefox" width={16} height={16} />,
  'Safari': () => <Image src="https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/safari/safari_48x48.png" alt="Safari" width={16} height={16} />,
  'Edge': () => <Image src="https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/edge/edge_48x48.png" alt="Edge" width={16} height={16} />,
  'Opera': () => <Image src="https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/opera/opera_48x48.png" alt="Opera" width={16} height={16} />,
  'Samsung Browser': () => <Image src="https://cdn.jsdelivr.net/gh/alrra/browser-logos/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung Browser" width={16} height={16} />,
  
  // Platforms
  'Windows': Computer,
  'macOS': Computer,
  'Linux': Computer,
  'iOS': Smartphone,
  'Android': Smartphone,

  // Default
  'Direct': Globe,
  'Unknown': HelpCircle,
};

const getCountryFlagUrl = (countryCode: string) => `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;

interface AnalyticsDetailCardProps<T> {
  title: string;
  data: T[];
  categoryKey: keyof T;
  valueKey: keyof T;
  defaultIconName?: keyof typeof iconMap;
}

export function AnalyticsDetailCard<T>({ title, data, categoryKey, valueKey, defaultIconName }: AnalyticsDetailCardProps<T>) {
  const total = data.reduce((acc, item) => acc + (Number(item[valueKey]) || 0), 0);
  
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">No data available yet.</CardDescription>
        </CardHeader>
        <CardContent>
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
            
            const IconComponent = iconMap[category] || (defaultIconName && iconMap[defaultIconName]) || null;
            const isCountryCard = title === 'Top Countries';
            const countryCode = isCountryCard ? category : null;

            return (
              <div key={index} className="flex items-center">
                 <div className="w-5 h-5 mr-3 flex items-center justify-center">
                    {isCountryCard && countryCode ? (
                        <Image src={getCountryFlagUrl(countryCode)} alt={countryCode} width={20} height={15} className="rounded-sm" />
                    ) : IconComponent ? (
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                    ) : (
                         <Globe className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
                <div className="flex-1 text-sm truncate" title={category}>{category}</div>
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
