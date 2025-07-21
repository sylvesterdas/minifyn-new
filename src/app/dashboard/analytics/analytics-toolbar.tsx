

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
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearching: boolean;
}

export function AnalyticsToolbar({ 
    dateRange, 
    setDateRange, 
    userLinks, 
    selectedLink, 
    setSelectedLink, 
    totalClicks,
    searchTerm,
    setSearchTerm,
    isSearching,
}: AnalyticsToolbarProps) {
     const richLinkOptions = userLinks.map(link => ({
            value: link.id,
            label: (
                <div className="flex flex-col" title={link.longUrl}>
                    <span className="font-mono text-sm">mnfy.in/{link.id}</span>
                    <span className="text-xs text-muted-foreground truncate">{link.longUrl}</span>
                </div>
            ),
            searchLabel: `mnfy.in/${link.id}`, // for the input display
        }));
    
    const selectedOptionDisplay = richLinkOptions.find(opt => opt.value === selectedLink)?.searchLabel || 'Select a link...';

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
                        for the selected link and period
                    </p>
                </CardContent>
            </Card>
            <div className="lg:col-span-3 flex flex-col md:flex-row items-center gap-4">
                <div className="w-full">
                    <label className="text-sm font-medium text-muted-foreground">Link</label>
                    <Combobox
                        options={richLinkOptions}
                        value={selectedLink}
                        onSelect={setSelectedLink}
                        placeholder={selectedOptionDisplay}
                        searchPlaceholder="Search links..."
                        emptyText="No matching links found."
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        isSearching={isSearching}
                    />
                </div>
                <div className="w-full">
                    <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                    <DateRangePicker 
                        date={dateRange} 
                        onDateChange={setDateRange}
                        numberOfDays={30}
                    />
                </div>
            </div>
        </div>
    );
}
