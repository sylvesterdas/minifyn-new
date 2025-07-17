
import { redirect } from 'next/navigation';

export default function SettingsPage() {
    // Redirect to the default profile tab
    redirect('/dashboard/settings/profile');
}
