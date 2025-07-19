
'use client';

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from './ui/button';
import { verifyOtpAndCreateUser, FormState } from '@/app/auth/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/gtag';

interface OtpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  password?: string;
  termsAccepted?: boolean;
  onSuccess: () => void;
}

function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending || disabled}>
            {pending ? <Loader2 className="animate-spin" /> : 'Verify & Create Account'}
        </Button>
    );
}

export function OtpDialog({ isOpen, onClose, email, password, termsAccepted, onSuccess }: OtpDialogProps) {
  const [otp, setOtp] = useState('');
  const { toast } = useToast();
  
  const initialState: FormState = { success: false };
  const [state, formAction] = useActionState(verifyOtpAndCreateUser, initialState);
  
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (state.error) {
      toast({ title: 'Error', description: state.error, variant: 'destructive' });
      if (state.otpError) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500); // Duration of the shake animation
        setOtp(''); // Clear OTP on error
      }
    }
    if (state.success) {
      toast({ title: 'Success!', description: state.message });
      trackEvent({ action: 'sign_up', category: 'conversion', label: 'email_password_signup_free' });
      onSuccess();
    }
  }, [state, toast, onSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Verification Code</DialogTitle>
          <DialogDescription>
            A 4-digit code was sent to <span className="font-semibold">{email}</span>. Please enter it below.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
            <div className="flex items-center justify-center space-x-2 py-4">
                <InputOTP
                    maxLength={4}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    name="otp"
                    render={({ slots }) => (
                    <InputOTPGroup className={cn(isShaking && 'animate-shake')}>
                        {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} className={cn(state.otpError && 'border-destructive')} />
                        ))}
                    </InputOTPGroup>
                    )}
                />
            </div>
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="password" value={password} />
            <input type="hidden" name="terms-accepted" value={termsAccepted ? 'on' : 'off'} />
            <DialogFooter>
                 <SubmitButton disabled={otp.length < 4} />
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
