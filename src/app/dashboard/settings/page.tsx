'use client';

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
            </TabsList>
            
            <TabsContent value="profile" className="pt-6">
                <ProfileCard />
            </TabsContent>

            <TabsContent value="api" className="pt-6">
                <ApiKeysCard />
            </TabsContent>
        </Tabs>
    </div>
  );
}
