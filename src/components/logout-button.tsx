'use client';

import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.refresh();
        router.push('/');
    };

    return (
        <Button onClick={handleLogout} variant="destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
        </Button>
    );
}
