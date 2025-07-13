'use client';

import { ProfileCard } from './profile-card';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        <ProfileCard />
    </div>
  );
}
