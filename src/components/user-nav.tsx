'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { logout } from '@/app/auth/actions';
import Link from 'next/link';
import { LayoutDashboard, LogOut, Settings, Key, LifeBuoy } from 'lucide-react';

export function UserNav() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    const getInitials = (email: string) => {
        return email?.[0]?.toUpperCase() ?? 'U';
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.picture ?? ''} alt={user.email ?? 'User'} />
                        <AvatarFallback>{getInitials(user.email ?? '')}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center">
                        <Key className="mr-2 h-4 w-4" />
                        <span>API Keys</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/help" className="flex items-center">
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Help</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action={logout} className="w-full">
                    <button type="submit" className="w-full text-left">
                        <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </button>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
