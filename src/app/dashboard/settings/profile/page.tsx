
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserProfile } from '../actions';
import { ProfileClientComponent } from './profile-client-component';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const { user } = await validateRequest();

    if (!user) {
        redirect('/auth/signin');
    }

    const { profile, error } = await getUserProfile();

    if (error || !profile) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>Could not load user profile: {error}</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return <ProfileClientComponent initialProfile={profile} />;
}
