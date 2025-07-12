'use client';

import { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"
import { QrCode, Download } from 'lucide-react';

export function QrCodeGeneratorForm() {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [includeLogo, setIncludeLogo] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const generateQrCode = async (text: string, withLogo: boolean) => {
        try {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const context = canvas.getContext('2d');
            if (!context) return;
            
            // Generate QR code to a data URL first
            const qrDataURL = await QRCode.toDataURL(text, {
                errorCorrectionLevel: 'H', // Use highest error correction level
                margin: 4,
                width: 256,
                color: {
                    dark: '#e2e8f0', // foreground
                    light: '#0000'  // transparent background
                }
            });

            const qrImage = new Image();
            qrImage.onload = () => {
                canvas.width = 256;
                canvas.height = 256;
                // Clear canvas and set background color
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = '#0f172a'; // The desired background color
                context.fillRect(0, 0, canvas.width, canvas.height);
                
                context.drawImage(qrImage, 0, 0);

                if (withLogo) {
                    const logo = new Image();
                    logo.src = '/logo.png';
                    logo.onload = () => {
                        const logoSize = canvas.width / 5; // 20% of the QR code size
                        const logoX = (canvas.width - logoSize) / 2;
                        const logoY = (canvas.height - logoSize) / 2;
                        
                        // Clear a rectangle in the center for the logo's background
                        const bgSize = logoSize + 8; // A bit larger for padding
                        const bgX = (canvas.width - bgSize) / 2;
                        const bgY = (canvas.height - bgSize) / 2;

                        context.fillStyle = '#0f172a'; // Match the main background
                        context.fillRect(bgX, bgY, bgSize, bgSize);
                        
                        // Draw the logo itself
                        context.drawImage(logo, logoX, logoY, logoSize, logoSize);
                        setQrCodeDataUrl(canvas.toDataURL('image/png'));
                    }
                    logo.onerror = () => {
                        // If logo fails, still show the QR code
                        setQrCodeDataUrl(canvas.toDataURL('image/png'));
                    }
                } else {
                     setQrCodeDataUrl(canvas.toDataURL('image/png'));
                }
            };
            qrImage.src = qrDataURL;

        } catch (err) {
            console.error(err);
            setQrCodeDataUrl(null);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputValue.trim()) {
            setQrCodeDataUrl(null);
            return;
        }
        generateQrCode(inputValue, includeLogo);
    };
    
    const handleDownload = () => {
        if (qrCodeDataUrl) {
            const link = document.createElement('a');
            link.href = qrCodeDataUrl;
            link.download = 'qrcode.png';
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
                     <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="include-logo" 
                            checked={includeLogo}
                            onCheckedChange={(checked) => setIncludeLogo(checked === true)}
                        />
                        <label
                          htmlFor="include-logo"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Include logo in QR code
                        </label>
                      </div>
                      <div className="flex items-center justify-center pt-4">
                          <canvas ref={canvasRef} style={{ display: qrCodeDataUrl ? 'block' : 'none' }} className="rounded-lg bg-white p-2" />
                      </div>
                     {qrCodeDataUrl && (
                        <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
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
