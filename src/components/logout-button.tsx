'use client';

import { logout } from "@/app/auth/actions";
import { useTransition } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function LogoutButton() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = () => {
        startTransition(async () => {
            const result = await logout();
            if (result.success) {
                toast({ description: "You have been logged out." });
                router.push('/auth/signin');
                router.refresh(); // Ensures the server state is re-fetched
            } else {
                toast({ title: "Logout Failed", description: result.error, variant: 'destructive' });
            }
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
