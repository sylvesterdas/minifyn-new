'use client';

import { useEffect, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { updateUserProfile, type UserProfile } from '../actions';
import { timezones } from '@/lib/timezones';
import { useRouter } from 'next/navigation';

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

interface ProfileClientComponentProps {
    initialProfile: UserProfile;
}

export function ProfileClientComponent({ initialProfile }: ProfileClientComponentProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile>(initialProfile);
    
    const [state, formAction] = useActionState(updateUserProfile, { success: false });

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
            // Refresh the page to get latest user info in the layout
             router.refresh();
        }
    }, [state, toast, router]);

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
