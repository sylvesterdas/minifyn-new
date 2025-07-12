'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Download } from 'lucide-react';

export function QrCodeGeneratorForm() {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputValue.trim()) {
            setQrCodeUrl(null);
            return;
        }
        const encodedData = encodeURIComponent(inputValue);
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?data=${encodedData}&size=256x256&bgcolor=0f172a&color=e2e8f0&qzone=1`);
    };
    
    const handleDownload = () => {
        if (qrCodeUrl) {
            const link = document.createElement('a');
            // Use a fetch request to get the image as a blob, which works around CORS issues with direct downloads.
            fetch(qrCodeUrl)
                .then(response => response.blob())
                .then(blob => {
                    link.href = URL.createObjectURL(blob);
                    link.download = 'qrcode.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch(console.error);
        }
    };

    return (
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/20 shadow-2xl shadow-black/20 rounded-t-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                    <QrCode className="text-primary" />
                    QR Code Generator
                </CardTitle>
                <CardDescription className="text-center pt-2">
                    Enter a URL or text to generate a QR code.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="qrData">URL or Text</Label>
                        <Textarea
                            id="qrData"
                            name="qrData"
                            placeholder="Enter any URL or text data..."
                            required
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            rows={4}
                        />
                    </div>
                     {qrCodeUrl && (
                        <div className="flex flex-col items-center justify-center gap-4 pt-4 animate-in fade-in duration-500">
                           <div className="p-2 bg-white rounded-lg">
                             <Image
                                src={qrCodeUrl}
                                alt="Generated QR Code"
                                width={200}
                                height={200}
                                unoptimized // QR code APIs may not support Next.js image optimization
                             />
                           </div>
                            <Button type="button" onClick={handleDownload} variant="secondary">
                                <Download className="mr-2 h-4 w-4" />
                                Download QR Code
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full font-semibold">
                        Generate QR Code
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
