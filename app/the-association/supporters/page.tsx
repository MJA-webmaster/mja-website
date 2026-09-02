export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import AssociationSidebar from '@/components/AssociationSidebar'
import NewsletterForm from '@/components/NewsletterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Supporters' }

export default async function SupportersPage() {
  const supabase = createClient()
  const { data: supporters } = await supabase
    .from('supporters')
    .select('*')
    .order('order', { ascending: true })

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="md:flex md:gap-16">
          <AssociationSidebar />
          <div className="flex-1 min-w-0">
            <h1 className="font-headline text-4xl font-black uppercase mb-4" style={{ color: '#0D1B2A' }}>
              Our <span style={{ color: '#E8192C' }}>Supporters</span>
            </h1>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-10 max-w-lg">
              MJA is grateful to the individuals, organizations, and institutions who support our mission to defend press freedom in the Maldives.
            </p>

            {supporters && supporters.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-12">
                {supporters.map((s) => (
                  <div key={s.id}
                    className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
                    style={{ borderTop: '3px solid #E8192C' }}
                  >
                    {s.logo_url ? (
                      <img src={s.logo_url} alt={s.name} className="h-10 w-auto object-contain mb-4" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-white text-xl font-bold"
                        style={{ backgroundColor: '#E8192C' }}>
                        {s.name[0]}
                      </div>
                    )}
                    <p className="font-bold text-navy text-sm">{s.name}</p>
                    {s.type && <p className="text-xs text-gray-400 mt-0.5">{s.type}</p>}
                    {s.website && (
                      <a href={s.website} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-semibold mt-3 inline-block hover:underline"
                        style={{ color: '#E8192C' }}>
                        Visit website →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 mb-12">
                <p className="text-4xl mb-3">🤝</p>
                <p className="font-semibold text-sm">No supporters listed yet</p>
                <p className="text-xs mt-1">Add supporters from the admin panel</p>
              </div>
            )}

            {/* Become a supporter CTA */}
            <div className="rounded-2xl p-8 text-white" style={{ backgroundColor: '#0D1B2A' }}>
              <h2 className="font-headline text-2xl font-black uppercase mb-3">
                Become a <span style={{ color: '#E8192C' }}>Supporter</span>
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-md">
                Your support helps MJA protect journalists, fight censorship, and defend the right to information across the Maldives.
              </p>
              <a href="/join-mja"
                className="inline-block text-white font-semibold px-8 py-3 rounded text-sm"
                style={{ backgroundColor: '#E8192C' }}>
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
