
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiKeyForUser } from '../actions';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ApiKeyClientComponent } from './api-key-client-component';

export const dynamic = 'force-dynamic';

export default async function ApiKeysPage() {
    const { user } = await validateRequest();

    if (!user) {
        redirect('/auth/signin');
    }

    const apiKey = await getApiKeyForUser(user.uid);

    return (
        <Card>
            <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys for programmatic access. Remember, you can only have one active key at a time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ApiKeyClientComponent initialApiKey={apiKey} />
            </CardContent>
        </Card>
    );
}
