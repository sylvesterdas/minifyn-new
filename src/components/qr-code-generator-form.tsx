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
    const [showQr, setShowQr] = useState(false);
    const qrcodeRef = useRef<HTMLDivElement>(null);
    const qrCodeInstance = useRef<EasyQRCodeJS | null>(null);

    const generateQrCode = (text: string) => {
        if (!qrcodeRef.current) return;
        
        qrcodeRef.current.innerHTML = '';

        const options = {
            text: text,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: EasyQRCodeJS.CorrectLevel.H,
            quietZone: 10,
            quietZoneColor: 'transparent',
            tooltip: false
        };

        qrCodeInstance.current = new EasyQRCodeJS(qrcodeRef.current, options);
        setShowQr(true);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputValue.trim()) {
            setShowQr(false);
            return;
        }
        generateQrCode(inputValue);
    };
    
    const handleDownload = () => {
       if (qrCodeInstance.current) {
           qrCodeInstance.current.download("minifyn-qrcode");
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
                      <div className={`flex flex-col items-center justify-center pt-4 ${showQr ? 'block' : 'hidden'}`}>
                           <div className="flex items-center gap-2 mb-4 animate-in fade-in duration-500">
                                <Image src="/logo.png" alt="MiniFyn Logo" width={24} height={24} />
                                <span className="text-lg font-semibold">MiniFyn</span>
                           </div>
                           <div ref={qrcodeRef}></div>
                      </div>
                     {showQr && (
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
