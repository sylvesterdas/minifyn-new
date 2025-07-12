import { UrlShortenerForm } from '@/components/url-shortener-form';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-slate-900/50">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_400px_at_50%_300px,#3b82f633,transparent)] -z-10"></div>
      <UrlShortenerForm />
    </main>
  );
}
