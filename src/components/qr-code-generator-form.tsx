
'use client';

import { useState, useRef } from 'react';
import EasyQRCodeJS from 'easyqrcodejs';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Download } from 'lucide-react';
import logo from './assets/logo.png'; // Import the logo

export function QrCodeGeneratorForm() {
    const [inputValue, setInputValue] = useState('');
    const [brandedQrImageDataUrl, setBrandedQrImageDataUrl] = useState<string | null>(null);
    const qrcodeRef = useRef<HTMLDivElement>(null);

    const createBrandedQrCode = (qrCodeDataUrl: string): Promise<string> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const qrSize = 256;
            const headerHeight = 50;
            const padding = 15;
            const logoSize = 32;

            canvas.width = qrSize + 2 * padding;
            canvas.height = qrSize + headerHeight + 2 * padding;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // White background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Load logo and QR code images
            const logoImg = new window.Image();
            logoImg.src = logo.src;
            
            const qrImg = new window.Image();
            qrImg.src = qrCodeDataUrl;

            // Wait for both images to load
            Promise.all([
                new Promise(res => logoImg.onload = res),
                new Promise(res => qrImg.onload = res)
            ]).then(() => {
                 // Draw header (centered)
                ctx.fillStyle = '#0f172a'; // Dark blue, matching theme
                ctx.font = 'bold 28px Inter, sans-serif';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';

                const brandText = 'MiniFyn.com';
                const textMetrics = ctx.measureText(brandText);
                const spaceBetween = 10;
                const totalBrandingWidth = logoSize + spaceBetween + textMetrics.width;
                const startX = (canvas.width - totalBrandingWidth) / 2;
                
                const logoX = startX;
                const logoY = (headerHeight - logoSize) / 2 + padding / 2;
                ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
                
                ctx.fillText(brandText, logoX + logoSize + spaceBetween, headerHeight / 2 + padding / 2);

                // Draw QR Code
                const qrX = padding;
                const qrY = headerHeight + padding;
                ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

                resolve(canvas.toDataURL('image/png'));
            });
        });
    }

    const generateQrCode = (text: string) => {
        if (!qrcodeRef.current) return;
        
        // Hide the container and clear previous QR code before generating new one
        qrcodeRef.current.style.display = 'none';
        qrcodeRef.current.innerHTML = '';
        setBrandedQrImageDataUrl(null);

        new EasyQRCodeJS(qrcodeRef.current, {
            text: text,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: EasyQRCodeJS.CorrectLevel.H,
            quietZone: 0, // No quiet zone from the library, we add our own padding
            onRenderingEnd: async (_: any, dataURL: any) => {
                const brandedUrl = await createBrandedQrCode(dataURL);
                setBrandedQrImageDataUrl(brandedUrl);
            },
            tooltip: false
        });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputValue.trim()) {
            setBrandedQrImageDataUrl(null);
            return;
        }
        generateQrCode(inputValue);
    };
    
    const handleDownload = () => {
       if (brandedQrImageDataUrl) {
           const link = document.createElement('a');
           link.href = brandedQrImageDataUrl;
           link.download = 'minifyn-qrcode.png';
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
       }
    };

    return (
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/20 shadow-2xl shadow-black/20 rounded-t-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                    <QrCode className="text-primary" />
                    Instant QR Codes
                </CardTitle>
                <CardDescription className="text-center pt-2">
                    Turn any link or text into a scannable QR code. It’s like magic, but for your phone.
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
                      <div className="flex flex-col items-center justify-center pt-4">
                            {brandedQrImageDataUrl && <Image src={brandedQrImageDataUrl} alt="Generated QR Code" width={286} height={336} className="rounded-lg shadow-md animate-in fade-in duration-500" />}
                            {/* This div is used by easyqrcodejs to render the initial qr code, but it's hidden from the user */}
                            <div ref={qrcodeRef} style={{ display: 'none' }}></div>
                      </div>
                     {brandedQrImageDataUrl && (
                        <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500 pt-4">
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
