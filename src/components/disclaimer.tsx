import Link from 'next/link';

export function Disclaimer() {
    return (
        <div className="my-8 max-w-4xl mx-auto text-center">
            <p className="text-xs text-muted-foreground">
                Your privacy is important. Our developer tools process everything in your browser, so your code never leaves your computer. Use of these tools is subject to our <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>.
            </p>
        </div>
    );
}
