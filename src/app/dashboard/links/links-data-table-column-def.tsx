
'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, ExternalLink, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { UserLink } from '../actions';
import { formatDistanceToNow } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

function ActionsCell({ link }: { link: UserLink }) {
  const { toast } = useToast();
  const shortUrl = `https://mnfy.in/${link.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: 'Copied!',
      description: 'Short link copied to clipboard.',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={copyToClipboard}>
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Link href={`/dashboard/analytics?shortcode=${link.id}`}>
                <LineChart className="mr-2 h-4 w-4" />
                View Analytics
            </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<UserLink>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'longUrl',
    header: 'Link',
    cell: ({ row }) => {
      const link = row.original;
      const isPermanent = link.expiresAt === -1 || link.plan === 'pro';
      const daysLeft = !isPermanent && link.expiresAt
        ? Math.max(0, Math.ceil((link.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)))
        : null;

      return (
        <div className="font-medium space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`https://mnfy.in/${link.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline text-primary inline-flex items-center gap-1 font-mono text-sm"
            >
              mnfy.in/{link.id} <ExternalLink className="h-3 w-3" />
            </a>
            {isPermanent ? (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium">
                Permanent
              </Badge>
            ) : daysLeft !== null && daysLeft > 0 ? (
              <Link href="/dashboard/settings/billing" className="inline-flex">
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20 transition-colors font-medium cursor-pointer">
                  Expires in {daysLeft}d • Upgrade
                </Badge>
              </Link>
            ) : (
              <Badge variant="destructive" className="text-[10px] py-0 px-1.5">
                Expired
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-md">
            {link.longUrl}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'clickCount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Clicks
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
            <Badge variant="secondary">{row.original.clickCount.toLocaleString()}</Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true });
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell link={row.original} />,
  },
];
