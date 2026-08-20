'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { syncRazorpaySubscription, createRazorpaySubscription, cancelRazorpaySubscription } from '@/app/payments/actions';
import { cancelUserPayPalSubscription, syncPayPalSubscription } from '@/app/payments/paypal-actions';
import { PayPalSubscriptionButton } from '@/components/paypal-subscription-button';
import { useState, useTransition, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, AlertTriangle, CheckCircle, CreditCard, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import Script from 'next/script';
import { trackEvent } from '@/lib/gtag';
import { format } from 'date-fns';

import { getPlanPricingForCountry, getPlanPricing } from '@/lib/plans';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface BillingClientComponentProps {
  user: any;
  initialSubscription: any;
  country: string | null;
}

function RestorePurchaseButton() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleRestore = () => {
    startTransition(async () => {
      // 1. Try syncing Razorpay
      const rzpResult = await syncRazorpaySubscription();
      if (rzpResult.success) {
        toast({
          title: 'Success!',
          description: 'Your Pro plan has been successfully synced via Razorpay!',
          variant: 'default',
        });
        window.location.reload();
        return;
      }

      toast({
        title: 'No Active Subscription Found',
        description: 'We could not find an active Pro subscription associated with your account.',
        variant: 'default',
      });
    });
  };

  return (
    <Button onClick={handleRestore} variant="secondary" disabled={isPending}>
      {isPending ? <Loader2 className="mr-2 animate-spin" /> : <RefreshCw className="mr-2" />}
      Restore Purchase
    </Button>
  );
}

function getPlanDetails(plan: string | undefined) {
  switch (plan) {
    case 'pro':
      return {
        name: 'Pro',
        description: 'You have access to all premium features.',
        badgeVariant: 'default',
      };
    case 'admin':
      return {
        name: 'Admin',
        description: 'You have full administrative access to all features.',
        badgeVariant: 'destructive',
      };
    default:
      return {
        name: 'Free',
        description: 'You are on the Free plan.',
        badgeVariant: 'secondary',
      };
  }
}

function formatRenewalDate(unixSeconds: unknown) {
  const seconds = typeof unixSeconds === 'number' ? unixSeconds : Number(unixSeconds);
  if (!Number.isFinite(seconds) || seconds <= 0) return 'Not available';
  const date = new Date(seconds * 1000);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return format(date, 'PPP');
}

export function BillingClientComponent({ user, initialSubscription, country }: BillingClientComponentProps) {
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [planType, setPlanType] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal'>('card');
  const [subscription, setSubscription] = useState<any | null>(initialSubscription);
  const [isCancelling, startCancelTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const isIndia = country === 'IN';
  const pricing = getPlanPricingForCountry(country);

  useEffect(() => {
    setSubscription(initialSubscription);
  }, [initialSubscription]);

  const planDetails = getPlanDetails(user?.plan);
  const isFreePlan = user?.plan === 'free';
  const isProPlan = user?.plan === 'pro';
  const isCancellationPending = subscription?.cancel_scheduled === true || subscription?.status === 'cancelled';

  const handleRazorpayUpgrade = async () => {
    if (!user || user.isAnonymous) {
      router.push(`/auth/signup?plan=${planType}`);
      return;
    }

    setIsLoadingPayment(true);
    trackEvent({
      action: 'click_upgrade',
      category: 'conversion',
      label: `upgrade_from_billing_${isIndia ? 'rzp_inr' : 'rzp_card'}_${planType}`,
      value: planType === 'monthly' ? pricing.monthlyPrice : pricing.yearlyPrice,
    });

    try {
      const subscriptionResult = await createRazorpaySubscription(planType, country);
      if ('error' in subscriptionResult) {
        throw new Error(subscriptionResult.error);
      }

      const options = {
        key: subscriptionResult.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscriptionResult.subscriptionId,
        name: 'MiniFyn Pro',
        description:
          planType === 'monthly'
            ? `Monthly Subscription (${pricing.monthlyFormatted}/mo)`
            : `Yearly Subscription (${pricing.yearlyFormatted}/yr)`,
        handler: async function (response: any) {
          toast({ title: 'Payment Successful!', description: 'Finalizing your upgrade...' });
          const syncResult = await syncRazorpaySubscription();

          if (syncResult.success) {
            toast({ title: 'Upgrade Complete!', description: 'Your plan has been upgraded to Pro.' });
            trackEvent({
              action: 'purchase',
              category: 'conversion',
              label: `pro_plan_upgrade_${planType}`,
              value: planType === 'monthly' ? pricing.monthlyPrice : pricing.yearlyPrice,
            });
            window.location.assign('/dashboard/settings/billing');
          } else {
            const errorMessage =
              ('error' in syncResult && syncResult.error) || 'An unknown error occurred during activation.';
            toast({ title: 'Activation Pending', description: errorMessage, variant: 'destructive' });
            setIsLoadingPayment(false);
          }
        },
        modal: {
          ondismiss: () => setIsLoadingPayment(false),
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#1e40af',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast({ title: 'Payment Failed', description: response.error.description, variant: 'destructive' });
        setIsLoadingPayment(false);
      });
      rzp.open();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not initiate payment.',
        variant: 'destructive',
      });
      setIsLoadingPayment(false);
    }
  };

  const handleCancel = () => {
    startCancelTransition(async () => {
      let result;
      if (subscription?.provider === 'paypal') {
        result = await cancelUserPayPalSubscription();
      } else {
        result = await cancelRazorpaySubscription();
      }

      if (result.success) {
        toast({
          title: 'Subscription Cancelled',
          description: 'Your Pro plan will not renew after the current cycle.',
        });
        window.location.reload();
      } else {
        toast({
          title: 'Cancellation Failed',
          description: result.error || 'Could not cancel your subscription. Please contact support.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Plan</CardTitle>
            <CardDescription>{planDetails.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div>
                <h3 className="text-lg font-semibold">MiniFyn {planDetails.name}</h3>
                {subscription?.provider && (
                  <p className="text-xs text-muted-foreground capitalize mt-0.5">
                    Billed via {subscription.provider}
                  </p>
                )}
              </div>
              <Badge variant={planDetails.badgeVariant as any} className="capitalize">
                {user?.plan}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {isFreePlan && (
          <Card>
            <CardHeader>
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Choose your billing cycle and preferred payment method to unlock all premium features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Billing Cycle Toggle */}
              <div className="flex justify-center items-center gap-4">
                <Label
                  htmlFor="plan-toggle"
                  className={cn(planType === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}
                >
                  Monthly
                </Label>
                <Switch
                  id="plan-toggle"
                  checked={planType === 'yearly'}
                  onCheckedChange={(checked) => setPlanType(checked ? 'yearly' : 'monthly')}
                  aria-label="Toggle between monthly and yearly billing"
                />
                <Label
                  htmlFor="plan-toggle"
                  className={cn(planType === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}
                >
                  Yearly{' '}
                  <span className="text-primary font-semibold">
                    (Save {pricing.yearlySavingsPercentage}%)
                  </span>
                </Label>
              </div>

              {/* Price Display */}
              <div className="text-center pt-2 transition-all duration-300 text-4xl font-bold">
                {planType === 'monthly' ? (
                  <span>
                    {pricing.monthlyFormatted}
                    <span className="text-base font-normal text-muted-foreground">
                      {pricing.currency === 'USD' ? ' USD' : ''} /month
                    </span>
                  </span>
                ) : (
                  <span>
                    {pricing.yearlyFormatted}
                    <span className="text-base font-normal text-muted-foreground">
                      {pricing.currency === 'USD' ? ' USD' : ''} /year
                    </span>
                  </span>
                )}
              </div>

              {/* Global Payment Method Selector (Card vs PayPal) */}
              {!isIndia && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={selectedMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => setSelectedMethod('card')}
                    className="gap-1.5 text-xs"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    Credit / Debit Card
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={selectedMethod === 'paypal' ? 'default' : 'outline'}
                    onClick={() => setSelectedMethod('paypal')}
                    className="gap-1.5 text-xs"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    PayPal
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {isIndia || selectedMethod === 'card' ? (
                <Button size="lg" className="w-full" onClick={handleRazorpayUpgrade} disabled={isLoadingPayment}>
                  {isLoadingPayment ? (
                    <Loader2 className="animate-spin" />
                  ) : isIndia ? (
                    'Pay with UPI / Cards / Netbanking'
                  ) : (
                    'Pay with Credit / Debit Card'
                  )}
                </Button>
              ) : (
                <div className="w-full">
                  <PayPalSubscriptionButton
                    planType={planType}
                    country={country}
                    onSuccess={() => {
                      toast({ title: 'Upgrade Complete!', description: 'Your plan is now Pro.' });
                      trackEvent({
                        action: 'purchase',
                        category: 'conversion',
                        label: `pro_plan_upgrade_paypal_${planType}`,
                        value: planType === 'monthly' ? pricing.monthlyPrice : pricing.yearlyPrice,
                      });
                      window.location.assign('/dashboard/settings/billing');
                    }}
                    onError={(err) => {
                      toast({
                        title: 'PayPal Error',
                        description: err,
                        variant: 'destructive',
                      });
                    }}
                  />
                </div>
              )}
            </CardFooter>
          </Card>
        )}

        {isProPlan &&
          (subscription ? (
            <Card>
              <CardHeader>
                <CardTitle>Manage Subscription</CardTitle>
                <CardDescription>Manage your current Pro subscription plan.</CardDescription>
              </CardHeader>
              <CardContent>
                {isCancellationPending ? (
                  <div className="p-4 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5" />
                    <div>
                      <h4 className="font-semibold text-yellow-300">Cancellation Scheduled</h4>
                      <p className="text-sm">
                        Your subscription has been cancelled. Pro features will remain active until{' '}
                        <span className="font-bold">
                          {formatRenewalDate(subscription.current_end || subscription.nextBillingTime / 1000)}.
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium capitalize flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {subscription.status}
                      </span>
                    </div>
                    {subscription.provider && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Provider</span>
                        <span className="font-medium capitalize">{subscription.provider}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Renewal / Expiry</span>
                      <span className="font-medium">
                        {formatRenewalDate(
                          subscription.current_end ||
                            (subscription.nextBillingTime ? new Date(subscription.nextBillingTime).getTime() / 1000 : null)
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
              {!isCancellationPending && (
                <CardFooter className="border-t pt-6">
                  <Button variant="destructive" onClick={handleCancel} disabled={isCancelling}>
                    {isCancelling && <Loader2 className="mr-2 animate-spin" />}
                    Cancel Subscription
                  </Button>
                </CardFooter>
              )}
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Subscription Active</CardTitle>
                <CardDescription>
                  Your Pro plan is active. To refresh your billing status, please use the restore button.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RestorePurchaseButton />
              </CardContent>
            </Card>
          ))}

        {isFreePlan && (
          <Card>
            <CardHeader>
              <CardTitle>Restore Purchase</CardTitle>
              <CardDescription>
                If you've paid but don't see your Pro features, click here to sync your latest subscription status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RestorePurchaseButton />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
