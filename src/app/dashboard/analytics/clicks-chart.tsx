'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ClicksChartProps {
    data: { date: string; clicks: number }[];
}

export function ClicksChart({ data }: ClicksChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[350px]">
                <p className="text-muted-foreground">Not enough data to display chart yet.</p>
            </div>
        );
    }
    
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                />
                 <Tooltip
                    cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                    labelStyle={{
                        color: 'hsl(var(--foreground))'
                    }}
                />
                <Bar dataKey="clicks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
