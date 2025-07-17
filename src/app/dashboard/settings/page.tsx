
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileCard } from './profile-card';
import { ApiKeysCard } from './api-keys-card';
import { BillingCard } from './billing-card';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 md:w-fit">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                    {user?.plan === 'pro' && <TabsTrigger value="billing">Billing</TabsTrigger>}
                </TabsList>
                <TabsContent value="profile" className="mt-6">
                    <ProfileCard />
                </TabsContent>
                <TabsContent value="api-keys" className="mt-6">
                    <ApiKeysCard />
                </TabsContent>
                {user?.plan === 'pro' && (
                    <TabsContent value="billing" className="mt-6">
                        <BillingCard />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
