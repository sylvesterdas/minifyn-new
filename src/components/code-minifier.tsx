
'use client';

import { useState, useTransition, useCallback, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, Loader2, ArrowRight, Clipboard, Check, Trash2, FolderUp, Settings2, Code, FileCode } from 'lucide-react';
import { minify } from 'terser';
import JSZip from 'jszip';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

type Language = 'javascript' | 'css' | 'html';

const minifyCss = (cssCode: string): string => {
    let minified = cssCode.replace(/\/\*[\s\S]*?\*\//g, ''); 
    minified = minified.replace(/\s*([,>+~{}\s])\s*/g, '$1'); 
    minified = minified.replace(/;}/g, '}');
    minified = minified.replace(/\s\s+/g, ' '); 
    return minified.trim();
};

const minifyHtml = (htmlCode: string): string => {
    let minified = htmlCode.replace(/<!--[\s\S]*?-->/g, ''); // Remove comments
    minified = minified.replace(/\s+/g, ' '); // Collapse whitespace
    minified = minified.replace(/> </g, '><'); // Remove space between tags
    return minified.trim();
};

const detectLanguage = (code: string): Language | null => {
    const trimmedCode = code.trim();
    if (trimmedCode.startsWith('<') && trimmedCode.endsWith('>')) return 'html';
    // Simple regex for CSS rules
    if (/[\.#]?[a-zA-Z0-9-]+\s*\{[^}]+\}/.test(trimmedCode)) return 'css';
    // Look for common JS keywords or patterns
    if (/(function|const|let|var|import|export|=>)/.test(trimmedCode)) return 'javascript';
    // Fallback checks
    if (trimmedCode.includes('{') && trimmedCode.includes('}')) return 'css';
    if (trimmedCode.includes('</')) return 'html';
    return null; // Could not detect
};


function BulkMinifier() {
    const [mangleJs, setMangleJs] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isZipping, startZipTransition] = useTransition();
    const { toast } = useToast();

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        startZipTransition(async () => {
            const zip = new JSZip();
            const minificationPromises = Array.from(files).map(async (file) => {
                const extension = file.name.split('.').pop()?.toLowerCase();
                const validExtensions = ['js', 'css', 'html'];

                if (!extension || !validExtensions.includes(extension)) {
                    toast({ title: "Skipped File", description: `Cannot minify '${file.name}'. Only .js, .css, and .html files are supported.`, variant: "destructive"});
                    return;
                }

                const content = await file.text();
                let minifiedContent: string;
                try {
                    if (extension === 'js') {
                        const result = await minify(content, { mangle: mangleJs, compress: true });
                        minifiedContent = result.code || '';
                    } else if (extension === 'css') {
                        minifiedContent = minifyCss(content);
                    } else { // html
                        minifiedContent = minifyHtml(content);
                    }
                } catch(e) {
                     toast({ title: "Minification Error", description: `Could not minify '${file.name}'.`, variant: "destructive"});
                     return;
                }

                const newFileName = file.name.replace(/\.(js|css|html)$/, `.min.${extension}`);
                zip.file(newFileName, minifiedContent);
            });

            await Promise.all(minificationPromises);
            
            if (Object.keys(zip.files).length > 0) {
                 zip.generateAsync({ type: 'blob' }).then((content) => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = 'minified-files.zip';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                });
            } else {
                 toast({ title: "No files minified", description: "Could not process any of the selected files."});
            }
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileCode className="h-6 w-6 text-primary"/> Bulk Minify</CardTitle>
                <CardDescription>Select multiple JS, CSS, or HTML files to minify and download them as a zip archive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept=".js,.css,.html"
                    className="hidden"
                />
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    disabled={isZipping}
                >
                    {isZipping ? (
                         <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing Files...
                        </>
                    ) : (
                         <>
                            <FolderUp className="mr-2 h-5 w-5" />
                            Select Files & Download Zip
                        </>
                    )}
                </Button>
                <Collapsible>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                            <Settings2 className="h-4 w-4 mr-2"/>
                            JavaScript Options
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="flex items-center space-x-2 p-4 border rounded-md mt-2">
                            <Switch 
                                id="mangle-js" 
                                checked={mangleJs} 
                                onCheckedChange={setMangleJs}
                            />
                            <Label htmlFor="mangle-js" className="cursor-pointer">Mangle variable names in JS files</Label>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-1">This applies to both bulk uploads and single-paste minification.</p>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
}


function SinglePasteMinifier() {
    const [inputCode, setInputCode] = useState('');
    const [outputCode, setOutputCode] = useState('');
    const [isPending, startTransition] = useTransition();
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();
    
    const inputSize = new Blob([inputCode]).size;
    const outputSize = new Blob([outputCode]).size;
    const sizeReduction = inputSize > 0 ? ((inputSize - outputSize) / inputSize) * 100 : 0;

    const handleMinify = useCallback(() => {
        if (!inputCode) {
            setOutputCode('');
            return;
        }

        const detectedLang = detectLanguage(inputCode);
        if (!detectedLang) {
            toast({ title: "Detection Failed", description: "Could not automatically detect the language. Please check your code.", variant: "destructive"});
            return;
        }

        toast({ title: "Language Detected", description: `Minifying as ${detectedLang.toUpperCase()}.`});

        startTransition(async () => {
            try {
                if (detectedLang === 'javascript') {
                    const result = await minify(inputCode, {
                        mangle: true,
                        compress: true,
                    });
                    setOutputCode(result.code || '');
                } else if (detectedLang === 'css') {
                    setOutputCode(minifyCss(inputCode));
                } else if (detectedLang === 'html') {
                    setOutputCode(minifyHtml(inputCode));
                }
            } catch (error) {
                console.error("Minification error:", error);
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
                setOutputCode(`// Error during minification:\n// ${errorMessage}`);
            }
        });
    }, [inputCode, toast]);
    
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
            const detectedLang = detectLanguage(outputCode) || 'text';
            const mimeType = {
                javascript: 'application/javascript',
                css: 'text/css',
                html: 'text/html',
                text: 'text/plain'
            }[detectedLang];
            const extension = {
                javascript: 'js',
                css: 'css',
                html: 'html',
                text: 'txt'
            }[detectedLang];
            
            const blob = new Blob([outputCode], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `minified.${extension}`;
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code className="h-6 w-6 text-primary"/> Single Paste</CardTitle>
                <CardDescription>Paste any JS, CSS, or HTML code into the editor below. The language will be detected automatically.</CardDescription>
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
                            placeholder={`Paste your code here...`}
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

export function CodeMinifier() {
    return (
        <div className="space-y-8">
            <BulkMinifier />
            <SinglePasteMinifier />
        </div>
    );
}
