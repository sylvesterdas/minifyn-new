
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSubscriptionDetails } from '@/app/payments/actions';
import { BillingClientComponent } from './billing-client-component';
import { headers } from 'next/headers';
import { getCountryFromIP } from '@/lib/ip-to-country';

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
    const { user } = await validateRequest();

    if (!user) {
        redirect('/auth/signin');
    }
    
    const ip = headers().get('x-forwarded-for') ?? headers().get('remote-addr');
    const country = await getCountryFromIP(ip);

    let subscription = null;
    if (user.plan === 'pro') {
        const { subscription: subDetails } = await getSubscriptionDetails();
        subscription = subDetails;
    }

    return (
        <BillingClientComponent user={user} initialSubscription={subscription} country={country} />
    );
}
