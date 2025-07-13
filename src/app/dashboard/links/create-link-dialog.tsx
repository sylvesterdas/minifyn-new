'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { shortenUrl } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Check, Clipboard, Loader2, PlusCircle } from 'lucide-react';

function SubmitButton({ pending, disabled }: { pending: boolean; disabled: boolean }) {
  return (
    <Button type="submit" className="w-full font-semibold" disabled={pending || disabled}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Shortening...
        </>
      ) : (
        <>
          Shorten URL
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const initialState = { success: false, message: '', shortUrl: '' };
  const [state, formAction, isPending] = useActionState(shortenUrl, initialState);

  useEffect(() => {
    if (state.success && state.shortUrl) {
      setShortenedUrl(state.shortUrl);
      formRef.current?.reset();
    } else if (!state.success && state.message) {
      toast({
        title: 'Oops!',
        description: state.message,
        variant: 'destructive',
      });
      // Keep dialog open on error
      setOpen(true); 
    }
  }, [state, toast]);

  const handleCopy = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  
  const onOpenChange = (isOpen: boolean) => {
    // Reset state when dialog is closed
    if (!isOpen) {
        setTimeout(() => { // delay to allow animation
            formRef.current?.reset();
            setShortenedUrl(null);
            setCopied(false);
        }, 300);
    }
    setOpen(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2"/>Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Short Link</DialogTitle>
          <DialogDescription>
            Enter a long URL to make it short. Click shorten when you're done.
          </DialogDescription>
        </DialogHeader>
        {shortenedUrl ? (
            <div className="py-4 space-y-4">
                <p className="text-sm text-center text-muted-foreground">Your new short link is ready!</p>
                <div className="w-full p-3 rounded-md bg-accent/20 border border-accent flex items-center justify-between animate-in fade-in duration-500">
                    <a href={shortenedUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-accent-foreground truncate hover:underline">
                        {shortenedUrl.replace(/^https?:\/\//, '')}
                    </a>
                    <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy to clipboard">
                        {copied ? <Check className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button">Done</Button>
                    </DialogClose>
                </DialogFooter>
            </div>
        ) : (
            <form ref={formRef} action={formAction} className="space-y-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="longUrl" className="sr-only">URL to shorten</Label>
                    <Input
                    id="longUrl"
                    name="longUrl"
                    placeholder="https://your-super-long-url.com/goes-here"
                    required
                    type="url"
                    />
                    <input type="hidden" name="userId" value={user?.uid ?? ''} />
                </div>
                <DialogFooter>
                    <SubmitButton pending={isPending} disabled={!user} />
                </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
