'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your name" defaultValue="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Your email" defaultValue="john.doe@example.com" disabled />
                        </div>
                    </CardContent>
                    <CardContent>
                        <Button>Save changes</Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="api" className="pt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>API Keys</CardTitle>
                        <CardDescription>Manage your API keys for programmatic access.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">Your API keys will appear here.</p>
                        <Button>Generate New Key</Button>
                    </CardContent>
                </Card>
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
