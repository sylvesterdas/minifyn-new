
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
import { auth as firebaseClientAuth } from '@/lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { login } from '@/app/auth/actions';

interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  name: string;
  password: string;
  onVerified: (customToken: string, name: string, email: string) => Promise<void>;
}

export function OtpDialog({ open, onOpenChange, email, name, password, onVerified }: OtpDialogProps) {
    const { toast } = useToast();
    const [otp, setOtp] = useState('');
    const [isSubmitting, startSubmitTransition] = useTransition();
    const [isSendingOtp, startSendOtpTransition] = useTransition();

    // Action for sending OTP
    const [sendState, sendFormAction] = useActionState(sendVerificationOtp, { success: false });

    // Action for verifying OTP and creating user
    const [verifyState, verifyFormAction, isVerifying] = useActionState(verifyOtpAndCreateUser, { success: false });
    
    const [resendCooldown, setResendCooldown] = useState(0);

    // Effect to send OTP when dialog opens
    useEffect(() => {
        if (open) {
            startSendOtpTransition(() => {
                const formData = new FormData();
                formData.append('email', email);
                sendFormAction(formData);
            });
            setResendCooldown(30);
        }
    }, [open, email, sendFormAction, startSendOtpTransition]);
    
    // Effect to handle cooldown timer
    useEffect(() => {
        if(resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Effect to show toasts based on action states
    useEffect(() => {
        if (sendState.message) toast({ description: sendState.message });
        if (sendState.error) {
            toast({ description: sendState.error, variant: 'destructive' });
        }
    }, [sendState, toast]);

    useEffect(() => {
        if (verifyState.error) {
            toast({ description: verifyState.error, variant: 'destructive' });
        }
        if (verifyState.success && verifyState.customToken) {
            toast({ description: "Email verified! Proceeding to payment..." });
            startSubmitTransition(async () => {
                await onVerified(verifyState.customToken!, name, email);
            });
        }
    }, [verifyState, toast, onVerified, name, email]);

    const handleResend = () => {
        if (resendCooldown === 0) {
            startSendOtpTransition(() => {
                const formData = new FormData();
                formData.append('email', email);
                sendFormAction(formData);
            });
            setResendCooldown(30);
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

    const isLoading = isSendingOtp || isVerifying || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Email</DialogTitle>
          <DialogDescription>
            We've sent a 6-digit code to {email}. Please enter it below to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
