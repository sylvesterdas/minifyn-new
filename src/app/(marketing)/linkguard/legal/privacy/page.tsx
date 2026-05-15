import type { Metadata } from 'next';
import { RebrandHandoff } from '@/components/rebrand-handoff';

export const metadata: Metadata = {
  title: 'LinkGuard Privacy has moved | MiniFyn',
  description: 'The LinkGuard privacy page has moved to ScamGuard: Link Checker.',
};

export default function LinkGuardPrivacyRebrandPage() {
  return (
    <RebrandHandoff
      destination="/scamguard/legal/privacy"
      label="/scamguard/legal/privacy"
    />
  );
}
