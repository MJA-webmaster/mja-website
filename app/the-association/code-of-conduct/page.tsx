import AssociationSidebar from '@/components/AssociationSidebar'
import NewsletterForm from '@/components/NewsletterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Code of Conduct' }

export default function CodeOfConductPage() {
  return (
    <>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="md:flex md:gap-16">
          <AssociationSidebar />
          <div className="flex-1 min-w-0 max-w-[680px]">
            <h1 className="font-headline text-4xl font-black uppercase mb-8" style={{ color: '#0D1B2A' }}>
              <span style={{ color: '#E8192C' }}>Code</span> of Conduct
            </h1>

            {[
              {
                title: '1. Accuracy and Fairness',
                body: 'MJA members commit to reporting facts accurately and presenting information fairly. Journalists must verify information before publication and correct errors promptly and transparently.',
              },
              {
                title: '2. Independence',
                body: 'Members must maintain editorial independence from political, commercial, and personal interests. Journalists should disclose any potential conflicts of interest to their editors and audiences.',
              },
              {
                title: '3. Humanity',
                body: 'Journalists must treat all individuals with dignity and respect. Special care must be taken when reporting on vulnerable groups, including children, victims of crime, and those experiencing trauma.',
              },
              {
                title: '4. Accountability',
                body: 'MJA members are accountable to the public they serve. They must be willing to engage in open dialogue about their reporting and accept criticism in a professional manner.',
              },
              {
                title: '5. Source Protection',
                body: 'Journalists must protect the confidentiality of sources who provide information under a guarantee of anonymity. This obligation may only be overridden in exceptional circumstances.',
              },
              {
                title: '6. Respect for Privacy',
                body: 'The right to privacy must be respected. Private individuals have stronger privacy rights than public figures. Intrusion into private life is only justified when there is genuine public interest.',
              },
              {
                title: '7. Professional Integrity',
                body: 'Members must not accept bribes, gifts, or any form of payment that could influence their reporting. Journalists must not misrepresent their identity or engage in deception to obtain information except in exceptional circumstances.',
              },
              {
                title: '8. Safety',
                body: 'MJA is committed to the safety of all journalists. Members should not take unnecessary risks and should report threats or harassment to the association immediately.',
              },
            ].map((item) => (
              <div key={item.title} className="mb-8 pb-8 border-b border-gray-100 last:border-0">
                <h2 className="font-bold text-navy text-[16px] mb-3">{item.title}</h2>
                <p className="text-gray-500 text-[14px] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <section className="py-14 px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline text-4xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
            Don't wait for information being deprived<br />of you to <span style={{ color: '#E8192C' }}>defend it!</span>
          </h2>
          <NewsletterForm />
        </div>
      </section>
    </>
  )
}
