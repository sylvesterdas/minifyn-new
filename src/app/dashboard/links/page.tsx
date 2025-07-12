'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

const mockLinks = [
  {
    id: '728ed52f',
    longUrl: 'https://example.com',
    status: 'active',
    clicks: 125,
    createdAt: '2023-07-12 10:42 AM',
  },
  {
    id: 'a8b4e1d9',
    longUrl: 'https://github.com/shadcn/ui',
    status: 'active',
    clicks: 250,
    createdAt: '2023-10-18 03:21 PM',
  },
  {
    id: 'f9c2d3a6',
    longUrl: 'https://vercel.com',
    status: 'paused',
    clicks: 50,
    createdAt: '2023-11-29 08:15 AM',
  },
  {
    id: '3e4f5a6b',
    longUrl: 'https://google.com',
    status: 'active',
    clicks: 500,
    createdAt: '2024-01-05 09:00 AM',
  },
  {
    id: 'c1d2e3f4',
    longUrl: 'https://firebase.google.com',
    status: 'expired',
    clicks: 0,
    createdAt: '2022-12-25 11:30 AM',
  },
];

export default function LinksPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold md:text-2xl">Links</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
          <CardDescription>
            Manage your shortened links and view their performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Short Link</TableHead>
                <TableHead className="hidden md:table-cell">Clicks</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">
                    <div className="font-medium">minifyn.io/{link.id}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {link.longUrl}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{link.clicks}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={link.status === 'active' ? 'default' : 'outline'}>
                      {link.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{link.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Copy</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-5</strong> of <strong>{mockLinks.length}</strong> links
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
