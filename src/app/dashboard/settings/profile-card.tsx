
'use client';

import { useEffect, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User } from 'lucide-react';
import { updateUserProfile, getUserProfile, type UserProfile } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import { timezones } from '@/lib/timezones';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                </>
            ) : 'Save changes' }
        </Button>
    );
}

function ProfileCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-24" />
            </CardFooter>
        </Card>
    );
}

export function ProfileCard() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { toast } = useToast();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [state, formAction] = useActionState(updateUserProfile, { success: false });

    useEffect(() => {
        if (user) {
            getUserProfile().then(({ profile, error }) => {
                if (profile) {
                    setProfile(profile);
                } else if (error) {
                    toast({ title: "Error", description: "Could not load profile data.", variant: 'destructive' });
                }
                setIsLoading(false);
            });
        }
    }, [user, toast]);

    useEffect(() => {
        if (state.error) {
            toast({
                title: 'Error',
                description: state.error,
                variant: 'destructive',
            });
        }
        if (state.success && state.message) {
             toast({
                title: 'Success!',
                description: state.message,
            });
             setTimeout(() => window.location.reload(), 1000);
        }
    }, [state, toast]);

    if (isAuthLoading || isLoading) {
        return <ProfileCardSkeleton />;
    }
    
    if (!user || !profile) {
        return <Card>
            <CardHeader>
                <CardTitle>Error</CardTitle>
                <CardDescription>Could not load user profile.</CardDescription>
            </CardHeader>
        </Card>;
    }

    return (
        <Card>
            <form action={formAction}>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="Your name" defaultValue={profile.name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Your email" value={profile.email} disabled />
                        <p className="text-sm text-muted-foreground">
                            Email address cannot be changed.
                        </p>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select name="role" defaultValue={profile.role}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="digital-marketer">Digital Marketer</SelectItem>
                                <SelectItem value="content-creator">Content Creator</SelectItem>
                                <SelectItem value="developer">Developer</SelectItem>
                                <SelectItem value="personal">Personal Use</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select name="timezone" defaultValue={profile.timezone}>
                            <SelectTrigger id="timezone">
                                <SelectValue placeholder="Select your timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                {timezones.map(tz => (
                                    <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" name="company" placeholder="Your company or website" defaultValue={profile.company} />
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}
