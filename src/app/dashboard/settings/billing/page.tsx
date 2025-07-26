
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSubscriptionDetails } from '@/app/payments/actions';
import { BillingClientComponent } from './billing-client-component';

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
    const { user } = await validateRequest();

    if (!user) {
        redirect('/auth/signin');
    }

    let subscription = null;
    if (user.plan === 'pro') {
        const { subscription: subDetails } = await getSubscriptionDetails();
        subscription = subDetails;
    }

    return (
        <BillingClientComponent user={user} initialSubscription={subscription} />
    );
}

