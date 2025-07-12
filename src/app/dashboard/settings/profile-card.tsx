'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

export function ProfileCard() {
    const { user } = useAuth();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" defaultValue={user?.name ?? ''} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email" defaultValue={user?.email ?? ''} disabled />
                </div>
                 <p className="text-sm text-muted-foreground">
                    Email address cannot be changed. Name feature is coming soon.
                </p>
            </CardContent>
            <CardContent>
                <Button disabled>Save changes</Button>
            </CardContent>
        </Card>
    );
}
