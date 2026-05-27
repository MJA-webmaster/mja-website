import AssociationSidebar from '@/components/AssociationSidebar'
import NewsletterForm from '@/components/NewsletterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Activities' }

export default function ActivitiesPage() {
  return (
    <>
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="flex gap-16">
          <AssociationSidebar />
          <div className="flex-1 min-w-0">
            <h1 className="font-headline text-4xl font-black uppercase mb-8" style={{ color: '#0D1B2A' }}>
              Our <span style={{ color: '#E8192C' }}>Activities</span>
            </h1>

            <div className="space-y-10">
              {[
                {
                  year: '2024',
                  items: [
                    { title: 'World Press Freedom Day Rally', desc: 'MJA organized a peaceful rally in Malé marking World Press Freedom Day, calling for stronger protections for journalists across the Maldives.' },
                    { title: 'Journalist Safety Workshop', desc: 'A two-day workshop on digital safety, source protection, and physical security for journalists working in the field.' },
                    { title: 'Press Freedom Index Launch', desc: 'MJA launched its annual Press Freedom Index, documenting the state of journalism and press freedom in the Maldives.' },
                  ]
                },
                {
                  year: '2023',
                  items: [
                    { title: 'Legal Aid Programme', desc: 'MJA provided legal representation for three journalists facing defamation charges in connection with their investigative reporting.' },
                    { title: 'Regional Media Summit', desc: 'Hosted a regional summit bringing together journalists and media organizations from across South Asia to discuss shared challenges.' },
                    { title: 'Code of Conduct Revision', desc: 'MJA updated its Code of Conduct for the first time in a decade, incorporating digital media guidelines and social media best practices.' },
                  ]
                },
                {
                  year: '2022',
                  items: [
                    { title: 'Emergency Support Fund', desc: 'Established an emergency support fund for journalists who lost employment during the media industry downturn.' },
                    { title: 'Freedom of Information Campaign', desc: 'Launched a nationwide campaign advocating for stronger freedom of information legislation in the Maldives.' },
                  ]
                },
              ].map((year) => (
                <div key={year.year}>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-headline text-2xl font-black" style={{ color: '#E8192C' }}>{year.year}</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className="space-y-6 pl-4 border-l-2" style={{ borderColor: '#F3F4F6' }}>
                    {year.items.map((item) => (
                      <div key={item.title} className="relative pl-6">
                        <div className="absolute left-[-9px] top-1.5 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: '#E8192C' }} />
                        <h3 className="font-bold text-navy text-[15px] mb-1">{item.title}</h3>
                        <p className="text-gray-500 text-[13px] leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
