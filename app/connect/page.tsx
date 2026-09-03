import ConnectForm from '@/components/ConnectForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connect',
  description: 'Get in touch with the Maldives Journalists Association.',
}

export default function ConnectPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 px-6" style={{ backgroundColor: '#0D1B2A' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#E8192C' }}>Get in Touch</p>
          <h1 className="font-headline text-5xl font-black text-white uppercase leading-none mb-4">
            Connect<br />with <span style={{ color: '#E8192C' }}>MJA</span>
          </h1>
          <p className="text-white/50 text-sm max-w-md leading-relaxed">
            Whether you're a journalist in need of support, a partner organization, or a member of the public — we want to hear from you.
          </p>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid md:grid-cols-[1fr_380px] gap-16">
          {/* Contact form */}
          <div>
            <h2 className="font-headline text-2xl font-black text-navy uppercase mb-8">Send us a Message</h2>
            <ConnectForm />
          </div>

          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-navy text-sm uppercase tracking-wider mb-4">Contact Information</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email', value: 'info@mja.mv', href: 'mailto:info@mja.mv' },
                  { label: 'Phone', value: '+960 300 0000', href: 'tel:+9603000000' },
                  { label: 'Address', value: 'Malé, Republic of Maldives', href: null },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-semibold text-navy hover:text-red transition-colors" style={{ '--hover': '#E8192C' } as React.CSSProperties}>
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-navy">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-bold text-navy text-sm uppercase tracking-wider mb-4">Follow Us</h3>
              <div className="space-y-3">
                {[
                  { label: 'Facebook', handle: '@MaldivesJournalists', href: '#' },
                  { label: 'Instagram', handle: '@mja.mv', href: '#' },
                  { label: 'Twitter / X', handle: '@MJAMaldives', href: '#' },
                  { label: 'LinkedIn', handle: 'Maldives Journalists Association', href: '#' },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank"
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors group">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 w-20">{s.label}</span>
                    <span className="text-sm text-navy group-hover:text-red transition-colors">{s.handle}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Report a case */}
            <div className="rounded-xl p-6 text-white" style={{ backgroundColor: '#E8192C' }}>
              <h3 className="font-headline font-bold text-lg uppercase mb-2">Report a Case</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                If you or a colleague is facing threats, harassment, or suppression — contact us immediately. MJA provides confidential support.
              </p>
              <a href="mailto:report@mja.mv"
                className="inline-block bg-white text-sm font-bold px-5 py-2.5 rounded transition-opacity hover:opacity-90"
                style={{ color: '#E8192C' }}>
                Report Confidentially →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
