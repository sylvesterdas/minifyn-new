
'use client';

import React from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserLink } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface AnalyticsToolbarProps {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
  userLinks: UserLink[];
  selectedLink: string;
  setSelectedLink: (linkId: string) => void;
  totalClicks: number;
}

export function AnalyticsToolbar({ dateRange, setDateRange, userLinks, selectedLink, setSelectedLink, totalClicks }: AnalyticsToolbarProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Total Clicks
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                    in the selected date range
                </p>
            </CardContent>
        </Card>
        <div className="lg:col-span-2 flex flex-col md:flex-row items-center gap-4">
             <div className="w-full">
                <label htmlFor="link-select" className="text-sm font-medium text-muted-foreground">Filter by Link</label>
                 <Select value={selectedLink} onValueChange={setSelectedLink}>
                    <SelectTrigger id="link-select">
                        <SelectValue placeholder="Select a link..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Links</SelectItem>
                        {userLinks.map(link => (
                            <SelectItem key={link.id} value={link.id}>
                               <span className="font-mono">mnfy.in/{link.id}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="w-full">
                 <label className="text-sm font-medium text-muted-foreground">Filter by Date</label>
                <DateRangePicker date={dateRange} onDateChange={setDateRange} />
             </div>
        </div>
    </div>
  );
}
