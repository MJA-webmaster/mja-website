import AssociationSidebar from '@/components/AssociationSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Association',
  description: 'Learn about the Maldives Journalists Association.',
}

export default function TheAssociationPage() {
  return (
    <>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="md:flex md:gap-16">
          <AssociationSidebar />
          <div className="flex-1 min-w-0">
            <div className="mb-12">
              <p className="text-base font-light text-gray-400 mb-1">
                <strong style={{ color: '#E8192C' }}>What is</strong> Maldives Journalist Association?
              </p>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-4">
                Maldives Journalists Association (MJA) is one of the leading independent organizations dedicated to promoting and defending freedom of information in the Maldives. Since its founding, MJA has worked tirelessly to ensure that journalists can operate freely, safely, and with integrity.
              </p>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-4">
                Thanks to its network of active correspondents and members across the country, MJA strives daily to maintain a free press in every corner of the Maldives.
              </p>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                Registered as a non-profit organization, it advocates for the rights of journalists at every level and is connected with key international press freedom bodies.
              </p>
            </div>

            <div className="mb-12">
              <p className="text-base font-light text-gray-400 mb-4">
                <strong style={{ color: '#E8192C' }}>How will</strong> your contribution be used?
              </p>
              <div className="space-y-8">
                {[
                  { num: '1.', title: 'Fighting against censorship', body: 'MJA acts in cooperation with institutions and authorities to fight censorship and laws aimed at restricting freedom of information.' },
                  { num: '2.', title: 'Supporting journalists', body: 'MJA provides material and legal aid to journalists needing urgent help, as well as to their families. MJA continuously monitors and denounces attacks on freedom of information nationwide.' },
                  { num: '3.', title: 'Mobilizing the opinion', body: 'In urgent situations, MJA organizes symbolic actions and campaigns to bring public attention to threats against press freedom.' },
                ].map((item) => (
                  <div key={item.num} className="grid grid-cols-[36px_1fr] gap-3">
                    <div className="font-headline text-2xl font-black" style={{ color: '#E8192C' }}>{item.num}</div>
                    <div>
                      <h3 className="font-bold text-navy text-[15px] mb-1.5">{item.title}</h3>
                      <p className="text-gray-500 text-[14px] leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-base font-light text-gray-400 mb-3">
                <strong style={{ color: '#E8192C' }}>What do I</strong> receive as a member?
              </p>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                All members receive official recognition and access to MJA resources. Sponsorship-level members receive additional benefits including a membership card and the Press Freedom publication.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-14 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
            Don't wait for information being deprived<br className="hidden md:block" />
            {' '}of you to <span style={{ color: '#E8192C' }}>defend it!</span>
          </h2>
        </div>
      </section>
    </>
  )
}
