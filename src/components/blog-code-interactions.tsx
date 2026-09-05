'use client';

import { useEffect } from 'react';

export function BlogCodeInteractions() {
  useEffect(() => {
    const handleCopy = async (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('.copy-code-btn') as HTMLElement | null;
      if (!target) return;

      const rawCode = target.getAttribute('data-code');
      if (!rawCode) return;

      try {
        const decoded = decodeURIComponent(rawCode);
        await navigator.clipboard.writeText(decoded);
        const originalText = target.innerText;
        target.innerText = 'Copied!';
        target.classList.add('text-primary');
        setTimeout(() => {
          target.innerText = originalText;
          target.classList.remove('text-primary');
        }, 2000);
      } catch {}
    };

    document.addEventListener('click', handleCopy);
    return () => document.removeEventListener('click', handleCopy);
  }, []);

  return null;
}
