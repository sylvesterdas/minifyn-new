'use client';

import { useState, useRef } from 'react';
import EasyQRCodeJS from 'easyqrcodejs';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Download } from 'lucide-react';

export function QrCodeGeneratorForm() {
    const [inputValue, setInputValue] = useState('');
    const [qrImageDataUrl, setQrImageDataUrl] = useState<string | null>(null);
    const qrcodeRef = useRef<HTMLDivElement>(null);

    const generateQrCode = (text: string) => {
        if (!qrcodeRef.current) return;
        
        // Hide the container and clear previous QR code before generating new one
        qrcodeRef.current.style.display = 'none';
        qrcodeRef.current.innerHTML = '';
        setQrImageDataUrl(null);

        const qrCodeInstance = new EasyQRCodeJS(qrcodeRef.current, {
            text: text,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: EasyQRCodeJS.CorrectLevel.H,
            quietZone: 15,
            quietZoneColor: '#ffffff',
            onRenderingEnd: (_, dataURL) => {
                combineWithLogo(dataURL);
            },
            tooltip: false
        });
    }

    const combineWithLogo = (qrDataUrl: string) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const logoImg = new window.Image();
        logoImg.src = '/logo.png';
        
        logoImg.onload = () => {
            const qrImg = new window.Image();
            qrImg.src = qrDataUrl;
            
            qrImg.onload = () => {
                // Define dimensions
                const qrSize = qrImg.width;
                const topMargin = 70; // Space for logo and text
                const padding = 20;

                canvas.width = qrSize;
                canvas.height = qrSize + topMargin;

                // White background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw Logo
                const logoSize = 40;
                const logoX = (canvas.width - logoSize) / 2;
                const logoY = padding / 2;
                ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

                // Draw Text
                const textY = logoY + logoSize + 10;
                ctx.font = 'bold 16px Inter';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.fillText('MiniFyn', canvas.width / 2, textY);

                // Draw QR Code
                ctx.drawImage(qrImg, 0, topMargin);
                
                setQrImageDataUrl(canvas.toDataURL('image/png'));
            };
        };
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputValue.trim()) {
            setQrImageDataUrl(null);
            return;
        }
        generateQrCode(inputValue);
    };
    
    const handleDownload = () => {
       if (qrImageDataUrl) {
           const link = document.createElement('a');
           link.href = qrImageDataUrl;
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
                      <div className="flex flex-col items-center justify-center pt-4">
                            {qrImageDataUrl && <Image src={qrImageDataUrl} alt="Generated QR Code" width={280} height={350} className="rounded-lg shadow-md animate-in fade-in duration-500" />}
                            {/* This div is used by easyqrcodejs to render the initial qr code, but it's hidden from the user */}
                            <div ref={qrcodeRef} style={{ display: 'none' }}></div>
                      </div>
                     {qrImageDataUrl && (
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
