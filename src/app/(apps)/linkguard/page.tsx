import type { Metadata } from 'next';
import { RebrandHandoff } from '@/components/rebrand-handoff';

export const metadata: Metadata = {
  title: 'LinkGuard is now ScamGuard: Link Checker | MiniFyn',
  description: 'LinkGuard has been rebranded to ScamGuard: Link Checker.',
};

export default function LinkGuardRebrandPage() {
  return <RebrandHandoff destination="/scamguard" label="/scamguard" />;
}
