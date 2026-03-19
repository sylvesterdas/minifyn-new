
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSubscriptionDetails } from '@/app/payments/actions';
import { BillingClientComponent } from './billing-client-component';
import { headers } from 'next/headers';
import { resolveCountryFromRequest } from '@/lib/geo';

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
    const { user } = await validateRequest();

    if (!user) {
        redirect('/auth/signin');
    }
    
    const hdrs = await headers();
    const ip = hdrs.get('x-forwarded-for') ?? hdrs.get('remote-addr');
    const country = await resolveCountryFromRequest({ headers: hdrs, ip });

    let subscription = null;
    if (user.plan === 'pro') {
        const { subscription: subDetails } = await getSubscriptionDetails();
        subscription = subDetails;
    }

    return (
        <BillingClientComponent user={user} initialSubscription={subscription} country={country} />
    );
}
