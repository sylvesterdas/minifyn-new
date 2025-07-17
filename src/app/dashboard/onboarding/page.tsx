
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { updateUserProfile } from '../settings/actions';
import { useRouter } from 'next/navigation';
import { timezones } from '@/lib/timezones';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                </>
            ) : 'Continue to Dashboard'}
        </Button>
    );
}

export default function OnboardingPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const [state, formAction] = useActionState(updateUserProfile, { success: false });

    useEffect(() => {
        if (state.error) {
            toast({
                title: 'Error',
                description: state.error,
                variant: 'destructive',
            });
        }
        if (state.success) {
            toast({
                title: 'Welcome!',
                description: 'Your profile has been updated.',
            });
            // Perform a hard refresh to ensure middleware re-evaluates auth state
            window.location.assign('/dashboard');
        }
    }, [state, toast, router]);

    return (
        <Card className="mx-auto max-w-lg">
            <form action={formAction}>
                 <input type="hidden" name="isOnboarding" value="true" />
                 <input type="hidden" name="name" value={user?.name || ''} />
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome to MiniFyn, {user?.name?.split(' ')[0]}!</CardTitle>
                    <CardDescription>
                        Tell us a little about yourself to personalize your experience. (This is optional!)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="role">What is your role?</Label>
                        <Select name="role">
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
                        <Select name="timezone">
                            <SelectTrigger id="timezone">
                                <SelectValue placeholder="Select your timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                {timezones.map(tz => (
                                    <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                         <p className="text-sm text-muted-foreground">
                            This helps us show analytics in your local time.
                        </p>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="company">Company Name or Website (Optional)</Label>
                        <Input id="company" name="company" placeholder="Your Company Inc. or yoursite.com" />
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <SubmitButton />
                    <Button variant="link" asChild>
                        <a href="/dashboard">Skip for now</a>
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
