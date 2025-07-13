'use client';

import { ApiKeysCard } from '../api-keys-card';

export default function ApiKeysPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-lg font-semibold md:text-2xl">API Keys</h1>
            <ApiKeysCard />
        </div>
    );
}
