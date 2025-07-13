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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, BarChart3, Copy, Trash2, Pencil } from 'lucide-react';
import { getUserLinks } from '../actions';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function LinksPage() {
  const links = await getUserLinks();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Links</h1>
        <Button asChild>
            <Link href="/">Create New Link</Link>
        </Button>
      </div>
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
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.length > 0 ? (
                links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">
                      <a href={`https://mnfy.in/${link.id}`} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">mnfy.in/{link.id}</a>
                      <div className="block text-sm text-muted-foreground md:inline max-w-[200px] md:max-w-sm truncate">
                        {link.longUrl}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{link.clickCount.toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
                    </TableCell>
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
                          <DropdownMenuItem disabled>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                             <BarChart3 className="mr-2 h-4 w-4" />
                             Analytics
                          </DropdownMenuItem>
                           <DropdownMenuItem disabled className="text-destructive focus:text-destructive">
                             <Trash2 className="mr-2 h-4 w-4" />
                             Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No links found. <Link href="/" className="text-primary underline">Create your first link!</Link>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{links.length}</strong> of <strong>{links.length}</strong> links
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
