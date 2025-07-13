'use client';

import { useState } from "react";
import { CodeBlock } from "./code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import Link from "next/link";

const snippets = {
    curl: `curl -X POST https://minifyn.com/api/shorten \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://your-long-url.com"}'`,
    
    javascript: `fetch('https://minifyn.com/api/shorten', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://your-long-url.com'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,

    python: `import requests
import json

api_key = 'YOUR_API_KEY'
long_url = 'https://your-long-url.com'

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}
payload = {'url': long_url}

response = requests.post(
    'https://minifyn.com/api/shorten', 
    headers=headers, 
    data=json.dumps(payload)
)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Error: {response.status_code}", response.text)`,

    php: `<?php
$apiKey = 'YOUR_API_KEY';
$longUrl = 'https://your-long-url.com';

$ch = curl_init('https://minifyn.com/api/shorten');

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['url' => $longUrl]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
curl_close($ch);

if ($response) {
    echo $response;
} else {
    echo 'Error: ' . curl_error($ch);
}
?>`
};

type Language = keyof typeof snippets;

export function DeveloperApiSection() {
    const [activeLang, setActiveLang] = useState<Language>('curl');

    return (
        <section id="for-developers" className="relative w-full py-12 md:py-24 lg:py-32">
         <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-5"></div>
            <div className="container mx-auto px-4 md:px-6 relative">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">For Developers</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Integrate with Ease</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Use our simple and powerful API to integrate link shortening into your own applications.
                        </p>
                    </div>
                </div>
                <div className="mx-auto max-w-3xl pt-12">
                    <Tabs defaultValue="curl" onValueChange={(value) => setActiveLang(value as Language)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                            <TabsTrigger value="curl">cURL</TabsTrigger>
                            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                            <TabsTrigger value="python">Python</TabsTrigger>
                            <TabsTrigger value="php">PHP</TabsTrigger>
                        </TabsList>
                         <div className="mt-4">
                            <CodeBlock code={snippets[activeLang]} language={activeLang === 'curl' ? 'bash' : activeLang} />
                         </div>
                    </Tabs>
                </div>
                <div className="mt-12 text-center">
                    <Button asChild size="lg">
                        <Link href="/auth/signup">Get your API Key</Link>
                    </Button>
                </div>
            </div>
      </section>
    );
}
