
'use client';

import React from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import type { UserLink } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

interface AnalyticsToolbarProps {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
  userLinks: UserLink[];
  selectedLink: string;
  setSelectedLink: (linkId: string) => void;
  totalClicks: number;
}

export function AnalyticsToolbar({ dateRange, setDateRange, userLinks, selectedLink, setSelectedLink, totalClicks }: AnalyticsToolbarProps) {
    const linkOptions = [
        {
            value: 'all',
            label: 'All Links',
            keywords: ['all', 'links']
        },
        ...userLinks.map(link => ({
            value: link.id,
            label: (
                <div className="flex flex-col" title={link.longUrl}>
                    <span className="font-mono text-sm">mnfy.in/{link.id}</span>
                    <span className="text-xs text-muted-foreground truncate">{link.longUrl}</span>
                </div>
            ),
            keywords: [link.id, link.longUrl, `mnfy.in/${link.id}`]
        }))
    ];

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
            <div className="lg:col-span-3 flex flex-col md:flex-row items-center gap-4">
                <div className="w-full">
                    <label className="text-sm font-medium text-muted-foreground">Filter by Link</label>
                    <Combobox
                        options={linkOptions}
                        value={selectedLink}
                        onSelect={setSelectedLink}
                        placeholder="Select a link..."
                        searchPlaceholder="Search by shortcode or URL..."
                        emptyText="No matching links found."
                    />
                </div>
                <div className="w-full">
                    <label className="text-sm font-medium text-muted-foreground">Filter by Date</label>
                    <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                </div>
            </div>
        </div>
    );
}
