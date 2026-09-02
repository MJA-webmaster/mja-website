import NewsletterForm from '@/components/NewsletterForm'
import MembershipLookup from '@/components/MembershipLookup'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Membership Status',
  description: 'Check your MJA membership ID and fee status.',
}

export default function MembershipStatusPage() {
  return (
    <>
      <section className="py-16 px-6" style={{ backgroundColor: '#0D1B2A' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#E8192C' }}>
            Members
          </p>
          <h1 className="font-headline text-5xl font-black text-white uppercase leading-none mb-4">
            Membership<br /><span style={{ color: '#E8192C' }}>Status</span>
          </h1>
          <p className="text-white/50 text-sm max-w-md leading-relaxed">
            Look up your membership ID and check whether your annual fee is up to date.
          </p>
        </div>
      </section>

      <div className="max-w-[520px] mx-auto px-6 py-14">
        <MembershipLookup />
      </div>

      <section className="py-14 px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline text-4xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
            Don&apos;t wait for information being deprived<br />
            of you to <span style={{ color: '#E8192C' }}>defend it!</span>
          </h2>
          <NewsletterForm />
        </div>
      </section>
    </>
  )
}
