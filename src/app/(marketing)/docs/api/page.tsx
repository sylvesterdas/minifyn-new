import { CodeBlock } from '@/components/code-block';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 0;

export const metadata: Metadata = {
    title: 'API Documentation | MiniFyn',
    description: 'Integrate MiniFyn\'s powerful link shortening capabilities into your application with our simple and robust API.',
    alternates: {
        canonical: 'https://www.minifyn.com/docs/api',
    },
};

const curlRequest = `curl -X POST https://minifyn.com/api/shorten \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://your-long-url.com"}'`;

const successResponse = `{
  "message": "URL shortened successfully",
  "shortUrl": "https://mnfy.in/abcdef"
}`;

const errorResponse = `{
  "error": "Please enter a valid URL."
}`;

export default function ApiDocsPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
            <div className="prose prose-invert mx-auto">
                <h1 className="text-4xl font-bold">API Documentation</h1>
                <p className="text-lg text-muted-foreground">
                    Integrate MiniFyn's powerful link shortening capabilities into your application with our simple and robust API.
                </p>

                <h2 className="mt-12 text-2xl font-semibold">Getting Started</h2>
                <p>
                    Welcome to the MiniFyn API! Our API is designed to be straightforward and easy to use. All endpoints are served over HTTPS. To get started, you'll need an API key.
                </p>

                <h2 className="mt-12 text-2xl font-semibold">Authentication</h2>
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>API Key</CardTitle>
                        <CardDescription>
                            All API requests must be authenticated with an API key. You can generate and manage your API keys from your dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">
                            Your API key must be included in the <code className="text-sm">Authorization</code> header as a Bearer token.
                        </p>
                        <p>
                            Don't have a key yet? <Link href="/dashboard/settings/api-keys">Generate one now</Link>.
                        </p>
                    </CardContent>
                </Card>

                <h2 className="mt-12 text-2xl font-semibold">Versioning</h2>
                <p>The current version of the API is <Badge variant="secondary">v1</Badge>. The API is stable, but any future breaking changes will be introduced under a new version number.</p>
                
                <h2 className="mt-12 text-2xl font-semibold">Endpoints</h2>

                <h3 className="mt-8 text-xl font-semibold">Shorten a URL</h3>
                <Badge variant="outline" className="text-base font-mono">POST /api/shorten</Badge>
                <p className="mt-4">Creates a new short link for the provided long URL.</p>

                <h4 className="mt-6 font-semibold">Headers</h4>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Header</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell><code className="text-sm">Authorization</code></TableCell>
                            <TableCell>Required. Your API key as a Bearer token (e.g., <code className="text-sm">mk_yourkey...</code>).</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><code className="text-sm">Content-Type</code></TableCell>
                            <TableCell>Required. Must be <code className="text-sm">application/json</code>.</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                
                <h4 className="mt-6 font-semibold">Body</h4>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Parameter</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell><code className="text-sm">url</code></TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>Required. The long URL you want to shorten.</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <h4 className="mt-6 font-semibold">Example Request</h4>
                <CodeBlock code={curlRequest} language="bash" />

                <h4 className="mt-6 font-semibold">Success Response (200 OK)</h4>
                <CodeBlock code={successResponse} language="json" />
                
                <h4 className="mt-6 font-semibold">Error Response (4xx)</h4>
                <CodeBlock code={errorResponse} language="json" />

                <h2 className="mt-12 text-2xl font-semibold">Rate Limiting</h2>
                <p>
                    To ensure fair usage and protect the service from abuse, the API is subject to rate limiting. Your API key allows for up to <strong>20 requests per day</strong>.
                </p>
                <p className="mt-4">
                    In addition to the daily quota, a time-based throttle is in place to prevent rapid-fire requests. You are limited to <strong>1 request per second</strong> per API key.
                </p>
                <p className="mt-4">
                    If you exceed either of these limits, you will receive a <code className="text-sm">429 Too Many Requests</code> HTTP status code.
                </p>
            </div>
        </div>
    );
}
