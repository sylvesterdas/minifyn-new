"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { getPayPalConfig, syncPayPalSubscription } from "@/app/payments/paypal-actions";

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalSubscriptionButtonProps {
  planType: "monthly" | "yearly";
  onSuccess: () => void;
  onError: (error: string) => void;
  onCancel?: () => void;
  idToken?: string;
}

export function PayPalSubscriptionButton({
  planType,
  onSuccess,
  onError,
  onCancel,
  idToken,
}: PayPalSubscriptionButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initPayPal() {
      try {
        setLoading(true);
        setErrorMessage(null);

        const res = await getPayPalConfig();
        if (res.error || !res.config) {
          throw new Error(res.error || "Failed to retrieve PayPal configuration");
        }

        const { clientId, monthlyPlanId, yearlyPlanId } = res.config;
        const targetPlanId = planType === "monthly" ? monthlyPlanId : yearlyPlanId;

        // Load PayPal Script if not present
        const scriptId = "paypal-sdk-subscription-script";
        if (!document.getElementById(scriptId)) {
          const script = document.createElement("script");
          script.id = scriptId;
          script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
            clientId
          )}&vault=true&intent=subscription`;
          script.async = true;

          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load PayPal SDK script"));
            document.body.appendChild(script);
          });
        }

        if (!window.paypal || !containerRef.current) {
          throw new Error("PayPal SDK is unavailable");
        }

        // Clear previous buttons
        containerRef.current.innerHTML = "";

        window.paypal
          .Buttons({
            style: {
              shape: "rect",
              color: "gold",
              layout: "vertical",
              label: "subscribe",
            },
            createSubscription: (data: any, actions: any) => {
              return actions.subscription.create({
                plan_id: targetPlanId,
              });
            },
            onApprove: async (data: any) => {
              try {
                setLoading(true);
                const syncRes = await syncPayPalSubscription(data.subscriptionID, idToken);
                if (syncRes.success) {
                  onSuccess();
                } else {
                  const msg = syncRes.error || "Subscription verification pending";
                  setErrorMessage(msg);
                  onError(msg);
                }
              } catch (e) {
                const msg = e instanceof Error ? e.message : "Error verifying subscription";
                setErrorMessage(msg);
                onError(msg);
              } finally {
                if (isMounted) setLoading(false);
              }
            },
            onCancel: () => {
              if (onCancel) onCancel();
            },
            onError: (err: any) => {
              const msg = err?.message || "PayPal checkout encountered an issue.";
              setErrorMessage(msg);
              onError(msg);
            },
          })
          .render(containerRef.current);

        if (isMounted) setLoading(false);
      } catch (err) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Failed to load PayPal";
          setErrorMessage(msg);
          setLoading(false);
          onError(msg);
        }
      }
    }

    initPayPal();

    return () => {
      isMounted = false;
    };
  }, [planType, idToken]);

  return (
    <div className="w-full">
      {loading && (
        <div className="flex items-center justify-center p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading PayPal Checkout...
        </div>
      )}
      {errorMessage && (
        <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-md mb-2">
          {errorMessage}
        </div>
      )}
      <div ref={containerRef} className={loading ? "hidden" : "w-full min-h-[50px]"} />
    </div>
  );
}
