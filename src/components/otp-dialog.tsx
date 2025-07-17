
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { sendVerificationOtp, verifyOtpAndCreateUser } from '@/app/auth/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  name: string;
  password: string;
  onVerified: (customToken: string, name: string, email: string) => void;
  isPaymentLoading: boolean;
}

export function OtpDialog({ open, onOpenChange, email, name, password, onVerified, isPaymentLoading }: OtpDialogProps) {
    const { toast } = useToast();
    const [otp, setOtp] = useState('');
    
    const [sendState, sendFormAction, isSendingOtp] = useActionState(sendVerificationOtp, { success: false });
    const [verifyState, verifyFormAction, isVerifying] = useActionState(verifyOtpAndCreateUser, { success: false });
    
    const [resendCooldown, setResendCooldown] = useState(0);
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        if(resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    useEffect(() => {
        if (sendState.message) {
            toast({ description: sendState.message });
            setOtpSent(true);
            setResendCooldown(30);
        }
        if (sendState.error) {
            toast({ description: sendState.error, variant: 'destructive' });
            setOtpSent(false);
        }
    }, [sendState, toast]);

    useEffect(() => {
        if (verifyState.error) {
            toast({ description: verifyState.error, variant: 'destructive' });
        }
        if (verifyState.success && verifyState.customToken) {
            toast({ description: "Email verified! Proceeding to payment..." });
            onVerified(verifyState.customToken!, name, email);
        }
    }, [verifyState, toast, onVerified, name, email]);

    const handleSendCode = () => {
        const formData = new FormData();
        formData.append('email', email);
        sendFormAction(formData);
    };

    const handleResend = () => {
        if (resendCooldown === 0) {
            handleSendCode();
        }
    };

    const handleVerify = () => {
        const formData = new FormData();
        formData.append('otp', otp);
        formData.append('email', email);
        formData.append('name', name);
        formData.append('password', password);
        verifyFormAction(formData);
    };

    const isLoading = isSendingOtp || isVerifying || isPaymentLoading;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="sm:max-w-md"
                onInteractOutside={(e) => {
                    if (isLoading) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>Verify Your Email for Pro</DialogTitle>
                    <DialogDescription>
                        {otpSent 
                            ? `We've sent a 6-digit code to ${email}. Please enter it below.`
                            : 'Click the button below to send a verification code to your email.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    {!otpSent ? (
                        <Button onClick={handleSendCode} disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Send Verification Code'}
                        </Button>
                    ) : (
                        <>
                            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            <Button onClick={handleVerify} disabled={isLoading || otp.length < 6} className="w-full">
                                {isLoading ? <Loader2 className="animate-spin" /> : "Verify and Purchase"}
                            </Button>
                            <div className="text-sm text-muted-foreground">
                                Didn't receive a code?{' '}
                                <Button
                                    variant="link"
                                    className="p-0 h-auto"
                                    onClick={handleResend}
                                    disabled={resendCooldown > 0 || isLoading}
                                >
                                    Resend {resendCooldown > 0 ? `(${resendCooldown}s)` : ''}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
