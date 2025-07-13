'use client';

import { logout } from "@/app/auth/actions";
import { useTransition } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleLogout = () => {
        startTransition(async () => {
            await logout();
            router.refresh(); // This clears the client-side router cache
            router.push('/auth/signin'); // This navigates to the sign-in page
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
