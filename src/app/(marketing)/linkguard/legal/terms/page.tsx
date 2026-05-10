import type { Metadata } from 'next';
import { RebrandHandoff } from '@/components/rebrand-handoff';

export const metadata: Metadata = {
  title: 'LinkGuard Terms have moved | MiniFyn',
  description: 'The LinkGuard terms page has moved to ScamGuard: Link Checker.',
};

export default function LinkGuardTermsRebrandPage() {
  return (
    <RebrandHandoff
      destination="/scamguard/legal/terms"
      label="/scamguard/legal/terms"
    />
  );
}
