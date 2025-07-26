import { getUserLinks, type UserLink } from '../actions';
import { LinksDataTable } from './links-data-table';
import { columns } from './links-data-table-column-def';
import { CreateLinkDialog } from './create-link-dialog';

export const dynamic = 'force-dynamic';

export default async function LinksPage() {
  const links = await getUserLinks();

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Links</h1>
        <CreateLinkDialog />
      </div>
      <div className="container mx-auto py-2 px-0">
        <LinksDataTable columns={columns} data={links} />
      </div>
    </div>
  );
}
