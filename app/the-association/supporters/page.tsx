import AssociationSidebar from '@/components/AssociationSidebar'
import NewsletterForm from '@/components/NewsletterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Supporters' }

export default function SupportersPage() {
  return (
    <>
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="flex gap-16">
          <AssociationSidebar />
          <div className="flex-1 min-w-0">
            <h1 className="font-headline text-4xl font-black uppercase mb-4" style={{ color: '#0D1B2A' }}>
              Our <span style={{ color: '#E8192C' }}>Supporters</span>
            </h1>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-12 max-w-lg">
              MJA is grateful to the individuals, organizations, and institutions who support our mission to defend press freedom in the Maldives.
            </p>

            {/* International partners */}
            <div className="mb-12">
              <h2 className="font-bold text-navy text-lg mb-6 pb-2 border-b border-gray-100">
                International Partners
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'International Federation of Journalists (IFJ)', type: 'Global federation' },
                  { name: 'Reporters Without Borders (RSF)', type: 'Press freedom NGO' },
                  { name: 'Committee to Protect Journalists (CPJ)', type: 'Press freedom NGO' },
                  { name: 'UNESCO', type: 'UN agency' },
                  { name: 'Freedom of the Press Foundation', type: 'Non-profit' },
                ].map((org) => (
                  <div
                    key={org.name}
                    className="bg-white border border-gray-100 rounded-xl p-5 hover:border-red hover:shadow-sm transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#E8192C' }}>
                      {org.name[0]}
                    </div>
                    <p className="font-semibold text-navy text-sm">{org.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{org.type}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Become a supporter */}
            <div className="rounded-2xl p-8 text-white" style={{ backgroundColor: '#0D1B2A' }}>
              <h2 className="font-headline text-2xl font-black uppercase mb-3">
                Become a <span style={{ color: '#E8192C' }}>Supporter</span>
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-md">
                Your support helps MJA protect journalists, fight censorship, and defend the public's right to information across the Maldives.
              </p>
              <a
                href="/join-mja"
                className="inline-block text-white font-semibold px-8 py-3 rounded text-sm"
                style={{ backgroundColor: '#E8192C' }}
              >
                Support MJA →
              </a>
            </div>
          </div>
        </div>
      </div>

      <section className="py-14 px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline text-4xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
            Don't wait for information being deprived<br />
            of you to <span style={{ color: '#E8192C' }}>defend it!</span>
          </h2>
          <NewsletterForm />
        </div>
      </section>
    </>
  )
}
