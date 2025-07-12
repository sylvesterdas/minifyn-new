'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApiKeysCard } from './api-keys-card';
import { ProfileCard } from './profile-card';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        
        <Tabs defaultValue="profile">
            <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="api">API Keys</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="pt-6">
                <ProfileCard />
            </TabsContent>

            <TabsContent value="api" className="pt-6">
                <ApiKeysCard />
            </TabsContent>

             <TabsContent value="billing" className="pt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Billing</CardTitle>
                        <CardDescription>Manage your subscription and payment details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">You are currently on the Free plan.</p>
                        <Button>Upgrade to Pro</Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
