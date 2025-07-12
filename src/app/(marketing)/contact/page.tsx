import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | MiniFyn',
  description: 'Get in touch with the MiniFyn team.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="first-name">First name</Label>
            <div className="mt-2.5">
              <Input type="text" name="first-name" id="first-name" autoComplete="given-name" />
            </div>
          </div>
          <div>
            <Label htmlFor="last-name">Last name</Label>
            <div className="mt-2.5">
              <Input type="text" name="last-name" id="last-name" autoComplete="family-name" />
            </div>
          </div>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="email">Email</Label>
          <div className="mt-2.5">
            <Input type="email" name="email" id="email" autoComplete="email" />
          </div>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="message">Message</Label>
          <div className="mt-2.5">
            <Textarea name="message" id="message" rows={4} />
          </div>
        </div>
        <div className="mt-10">
          <Button type="submit" className="w-full">
            Send message
          </Button>
        </div>
      </form>
    </div>
  );
}
