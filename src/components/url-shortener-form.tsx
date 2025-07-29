"use client";

import { useEffect, useState, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { shortenUrl, type FormState } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Clipboard, Check, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInAnonymously,
  type User,
} from "firebase/auth";
import Link from "next/link";
import Logo from "./logo";
import { trackEvent } from "@/lib/gtag";

function SubmitButton({
  disabled,
}: {
  disabled: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full font-semibold"
      disabled={pending || disabled}
    >
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

export function UrlShortenerForm() {
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthLoading(false);
      } else {
        signInAnonymously(auth)
          .then((anonUser) => {
            setCurrentUser(anonUser.user);
          })
          .catch((error) => {
            console.error("Anonymous sign-in failed:", error);
          })
          .finally(() => {
            setIsAuthLoading(false);
          });
      }
    });
    return () => unsubscribe();
  }, []);

  const initialState: FormState = { success: false, message: "" };
  const [state, formAction] = useFormState(
    shortenUrl,
    initialState
  );

  useEffect(() => {
    if (!state.success && state.message) {
      if (state.errorCode === "ANON_LIMIT_REACHED") {
        setShowSignupPrompt(true);
        trackEvent({
          action: "conversion_prompt_shown",
          category: "url_shortener",
          label: "anonymous_rate_limit",
        });
      } else {
        toast({
          title: "Oops!",
          description: state.message,
          variant: "destructive",
        });
        trackEvent({
          action: "shorten_url_error",
          category: "url_shortener",
          label: state.message,
        });
      }
    } else if (state.success && state.shortUrl) {
      setShortenedUrl(state.shortUrl);
      setShowSignupPrompt(false); // Reset prompt on success
      formRef.current?.reset();
      trackEvent({
        action: "shorten_url_success",
        category: "url_shortener",
        label: state.shortUrl,
      });
    }
  }, [state, toast]);

  const handleCopy = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        trackEvent({
          action: "copy_short_url",
          category: "url_shortener",
          label: shortenedUrl,
        });
      });
    }
  };

  const handleSignUpClick = () => {
    trackEvent({
      action: "click_signup_prompt",
      category: "url_shortener",
      label: "anonymous_rate_limit_cta",
    });
  };

  return (
    <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/20 shadow-2xl shadow-black/20 rounded-t-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Logo />
          {process.env.NEXT_PUBLIC_SHORT_DOMAIN || "mnfy.in"}
        </CardTitle>
        <CardDescription className="text-center pt-2">
          Tame your wild, long URLs. Give them a short, memorable alias.
        </CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="longUrl">URL to shorten</Label>
            <Input
              id="longUrl"
              name="longUrl"
              placeholder="https://your-super-long-url.com/goes-here"
              required
              type="url"
            />
            <input type="hidden" name="userId" value={currentUser?.uid ?? ""} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {showSignupPrompt ? (
            <div className="w-full text-center space-y-3 animate-in fade-in duration-500">
              <p className="text-sm text-muted-foreground">
                Daily limit reached.
              </p>
              <Button
                asChild
                className="w-full font-semibold"
                onClick={handleSignUpClick}
              >
                <Link href="/auth/signup">Sign Up for More Links</Link>
              </Button>
            </div>
          ) : (
            <SubmitButton disabled={isAuthLoading} />
          )}

          {shortenedUrl && (
            <div className="w-full p-3 rounded-md bg-accent/20 border border-accent flex items-center justify-between animate-in fade-in duration-500">
              <a
                href={shortenedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-accent-foreground truncate hover:underline"
              >
                {shortenedUrl.replace(/^https?:\/\//, "")}
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                aria-label="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Clipboard className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
