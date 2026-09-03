import AssociationSidebar from '@/components/AssociationSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Values' }

export default function ValuesPage() {
  return (
    <>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="md:flex md:gap-16">
          <AssociationSidebar />
          <div className="flex-1 min-w-0">
            <h1 className="font-headline text-4xl font-black uppercase mb-8" style={{ color: '#0D1B2A' }}>
              Our <span style={{ color: '#E8192C' }}>Values</span>
            </h1>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '🎯',
                  title: 'Truth',
                  body: 'We are committed to accurate, fair, and impartial journalism. Truth is the foundation of everything we do.',
                },
                {
                  icon: '🛡️',
                  title: 'Independence',
                  body: 'We defend editorial independence from political, commercial, and personal interests at all levels.',
                },
                {
                  icon: '🤝',
                  title: 'Solidarity',
                  body: 'We stand together with journalists facing threats, intimidation, or suppression, locally and globally.',
                },
                {
                  icon: '⚖️',
                  title: 'Justice',
                  body: "We advocate for fair legal frameworks that protect journalists and uphold the public's right to information.",
                },
                {
                  icon: '💡',
                  title: 'Innovation',
                  body: 'We embrace new tools and platforms to strengthen journalism and reach wider audiences across the Maldives.',
                },
                {
                  icon: '🌍',
                  title: 'Global Connection',
                  body: 'We connect Maldivian journalists with the global community to share knowledge and best practices.',
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-sm transition-all"
                >
                  <div className="text-3xl mb-3">{value.icon}</div>
                  <h3 className="font-bold text-navy text-[16px] mb-2">{value.title}</h3>
                  <p className="text-gray-500 text-[13px] leading-relaxed">{value.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="py-14 px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline text-4xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
            Don&apos;t wait for information being deprived<br />of you to <span style={{ color: '#E8192C' }}>defend it!</span>
          </h2>
        </div>
      </section>
    </>
  )
}
