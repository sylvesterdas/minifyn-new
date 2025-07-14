import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'DMCA Policy | MiniFyn',
  description: 'Our policy for handling DMCA takedown notices.',
  alternates: {
    canonical: 'https://www.minifyn.com/dmca',
  },
};

export default function DmcaPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <div className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-bold">DMCA Takedown Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

            <p>MiniFyn respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, the text of which may be found on the U.S. Copyright Office website at <a href="http://www.copyright.gov/legislation/dmca.pdf" target="_blank" rel="noopener noreferrer">http://www.copyright.gov/legislation/dmca.pdf</a>, MiniFyn will respond expeditiously to claims of copyright infringement committed using the MiniFyn service that are reported to our Designated Copyright Agent.</p>

            <h2 className="mt-8 text-2xl font-semibold">1. Notice of Infringement</h2>
            <p>If you are a copyright owner, or are authorized to act on behalf of one, please report alleged copyright infringements by completing the following DMCA Notice of Alleged Infringement and delivering it to our Designated Copyright Agent. Upon receipt of the Notice as described below, we will take whatever action, in our sole discretion, we deem appropriate, including removal of the challenged material from the Service.</p>
            <p>Your notice must include:</p>
            <ul>
                <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                <li>Identification of the copyrighted work claimed to have been infringed.</li>
                <li>Identification of the material that is claimed to be infringing and that is to be removed, and information reasonably sufficient to permit us to locate the material (e.g., the shortened URL).</li>
                <li>Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and, if available, an email address.</li>
                <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
                <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold">2. Counter-Notice</h2>
            <p>If you believe that your content that was removed is not infringing, or that you have the authorization from the copyright owner, the copyright owner’s agent, or pursuant to the law, to post and use the material, you may send a counter-notice containing the required information to our Copyright Agent.</p>

            <h2 className="mt-8 text-2xl font-semibold">3. Designated Copyright Agent</h2>
            <p>Our Designated Copyright Agent can be reached via our <Link href="/contact">contact page</Link>.</p>
        </div>
    </div>
  );
}
