import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogoutButton } from '@/components/logout-button';

export default async function DashboardPage() {
    const { user } = await validateRequest();

    if (!user) {
        return redirect('/auth/signin');
    }

    return (
        <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
            <div className="space-y-8">
                <h1 className="text-4xl font-bold">Dashboard</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Welcome, {user.email || 'User'}!</CardTitle>
                        <CardDescription>
                            This is your protected dashboard area.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>Your user ID is: <code className="bg-muted p-1 rounded">{user.id}</code></p>
                        <p>Your email is: <code className="bg-muted p-1 rounded">{user.email}</code></p>
                        <p>Email verified: <code className="bg-muted p-1 rounded">{user.emailVerified ? 'Yes' : 'No'}</code></p>
                        <LogoutButton />
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
