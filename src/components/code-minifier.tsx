
'use client';

import { useState, useTransition, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, Loader2, ArrowRight, Clipboard, Check, Trash2 } from 'lucide-react';
import { minify } from 'terser';

type Language = 'javascript' | 'css';

const minifyCss = (cssCode: string): string => {
    // Basic CSS minification: remove comments, extra whitespace, and newlines.
    let minified = cssCode.replace(/\/\*[\s\S]*?\*\//g, ''); // remove comments
    minified = minified.replace(/\s*([,>+~{}\s])\s*/g, '$1'); // remove whitespace around selectors and braces
    minified = minified.replace(/;}/g, '}'); // remove last semicolon in a block
    minified = minified.replace(/\s\s+/g, ' '); // collapse multiple spaces
    return minified.trim();
};

export function CodeMinifier() {
    const [language, setLanguage] = useState<Language>('javascript');
    const [inputCode, setInputCode] = useState('');
    const [outputCode, setOutputCode] = useState('');
    const [isPending, startTransition] = useTransition();
    const [copied, setCopied] = useState(false);
    
    const inputSize = new Blob([inputCode]).size;
    const outputSize = new Blob([outputCode]).size;
    const sizeReduction = inputSize > 0 ? ((inputSize - outputSize) / inputSize) * 100 : 0;

    const handleMinify = useCallback(() => {
        if (!inputCode) {
            setOutputCode('');
            return;
        }
        startTransition(async () => {
            try {
                if (language === 'javascript') {
                    const result = await minify(inputCode, {
                        mangle: true,
                        compress: true,
                    });
                    setOutputCode(result.code || '');
                } else if (language === 'css') {
                    const result = minifyCss(inputCode);
                    setOutputCode(result);
                }
            } catch (error) {
                console.error("Minification error:", error);
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
                setOutputCode(`// Error during minification:\n// ${errorMessage}`);
            }
        });
    }, [inputCode, language]);
    
    const handleCopy = () => {
        if (outputCode) {
            navigator.clipboard.writeText(outputCode).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };
    
    const handleDownload = () => {
        if (outputCode) {
            const blob = new Blob([outputCode], { type: language === 'javascript' ? 'application/javascript' : 'text/css' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `minified.${language === 'javascript' ? 'js' : 'css'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };
    
    const handleClear = () => {
        setInputCode('');
        setOutputCode('');
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <Tabs defaultValue="javascript" onValueChange={(value) => setLanguage(value as Language)}>
                    <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                        <TabsTrigger value="css">CSS</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Input Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Input</h3>
                            <Button variant="ghost" size="icon" onClick={handleClear} disabled={!inputCode && !outputCode}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Clear</span>
                            </Button>
                        </div>
                        <Textarea
                            placeholder={`Paste your ${language === 'javascript' ? 'JS' : 'CSS'} code here...`}
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            className="h-80 font-mono text-xs"
                            aria-label="Code Input"
                        />
                        <Button onClick={handleMinify} disabled={isPending || !inputCode} className="w-full">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Minifying...
                                </>
                            ) : (
                                <>
                                    Minify Code
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                    
                    {/* Output Section */}
                    <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Output</h3>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!outputCode}>
                                    {copied ? <Check className="h-4 w-4 text-green-500"/> : <Clipboard className="h-4 w-4" />}
                                    <span className="sr-only">Copy</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={handleDownload} disabled={!outputCode}>
                                    <FileDown className="h-4 w-4" />
                                    <span className="sr-only">Download</span>
                                </Button>
                            </div>
                        </div>
                        <Textarea
                            placeholder="Minified code will appear here..."
                            value={outputCode}
                            readOnly
                            className="h-80 font-mono text-xs bg-muted/50"
                            aria-label="Code Output"
                        />
                         {outputCode && (
                            <div className="text-sm text-muted-foreground text-center animate-in fade-in duration-500">
                                Original: <span className="font-medium text-foreground">{(inputSize / 1024).toFixed(2)} KB</span>
                                 | Minified: <span className="font-medium text-foreground">{(outputSize / 1024).toFixed(2)} KB</span>
                                 | Reduction: <span className="font-medium text-green-400">{sizeReduction.toFixed(2)}%</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
