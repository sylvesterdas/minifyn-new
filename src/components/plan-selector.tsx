
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { CheckCircle, ShieldCheck, Star } from 'lucide-react';
import { Label } from './ui/label';

export type Plan = 'free' | 'pro';

interface PlanSelectorProps {
    selectedPlan: Plan;
    onPlanChange: (plan: Plan) => void;
}

export function PlanSelector({ selectedPlan, onPlanChange }: PlanSelectorProps) {
  return (
    <RadioGroup
      value={selectedPlan}
      onValueChange={(value: Plan) => onPlanChange(value)}
      className="grid grid-cols-2 gap-4"
    >
      <div>
        <RadioGroupItem value="free" id="free" className="peer sr-only" />
        <Label
          htmlFor="free"
          className={cn(
            "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
            "cursor-pointer"
          )}
        >
          <CardHeader className="p-0 text-center">
            <CardTitle className="text-lg">Free</CardTitle>
            <CardDescription className="text-xs">For personal use</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <span className="text-2xl font-bold">₹0</span>
          </CardContent>
        </Label>
      </div>
      <div>
        <RadioGroupItem value="pro" id="pro" className="peer sr-only" />
        <Label
          htmlFor="pro"
          className={cn(
            "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
            "cursor-pointer relative"
          )}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star className="h-3 w-3" /> Recommended
          </div>
          <CardHeader className="p-0 text-center">
            <CardTitle className="text-lg">Pro</CardTitle>
            <CardDescription className="text-xs">For power users</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <span className="text-2xl font-bold">₹149</span>
            <span className="text-xs text-muted-foreground">/mo</span>
          </CardContent>
        </Label>
      </div>
    </RadioGroup>
  );
}
