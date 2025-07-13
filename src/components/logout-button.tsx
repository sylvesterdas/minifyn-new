'use client';

import { logout } from "@/app/auth/actions";
import { useTransition } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { LogOut, Loader2 } from "lucide-react";

export function LogoutButton() {
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            const result = await logout();
            if (result.success) {
                // Force a hard navigation to clear all client-side state
                window.location.assign('/auth/signin');
            }
            // If logout fails, we can optionally show an error, but for now we just won't redirect.
        });
    };

    return (
        <DropdownMenuItem onClick={handleLogout} disabled={isPending} className="cursor-pointer">
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <LogOut className="mr-2 h-4 w-4" />
            )}
            <span>Log out</span>
        </DropdownMenuItem>
    );
}
