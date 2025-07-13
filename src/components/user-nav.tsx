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
import Link from 'next/link';
import { LayoutDashboard, LogOut, Settings, Key, LifeBuoy } from 'lucide-react';
import { LogoutButton } from './logout-button';

export function UserNav() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    const getInitials = (name?: string | null, email?: string | null) => {
        if (name) {
            const names = name.split(' ');
            if (names.length > 1) {
                return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
        }
        if (email) {
            return email[0].toUpperCase();
        }
        return 'U';
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.picture ?? ''} alt={user.name ?? user.email ?? 'User'} />
                        <AvatarFallback>{getInitials(user.name, user.email)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                         <p className="text-sm font-medium leading-none">
                            {user.name ?? 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings/api-keys" className="flex items-center cursor-pointer">
                        <Key className="mr-2 h-4 w-4" />
                        <span>API Keys</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/help" target="_blank" rel="noopener noreferrer" className="flex items-center cursor-pointer">
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Help</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutButton />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
