'use client';

import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    return (
        <form action={logout}>
            <Button type="submit" variant="destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
            </Button>
        </form>
    );
}
