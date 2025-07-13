
'use client';

import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import { Button } from './ui/button';
import { Check, Clipboard } from 'lucide-react';

// Register only the languages we need
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('php', php);
hljs.registerLanguage('python', python);


interface CodeBlockProps {
    code: string;
    language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
    const codeRef = useRef<HTMLElement>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (codeRef.current) {
            hljs.highlightElement(codeRef.current);
        }
    }, [code, language]);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="space-y-2">
            <pre className="hljs !p-4 overflow-x-auto">
                <code ref={codeRef} className={`language-${language}`}>
                    {code}
                </code>
            </pre>
            <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                aria-label="Copy code"
                className="w-full md:w-auto"
            >
                {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Clipboard className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Code'}
            </Button>
        </div>
    );
}
