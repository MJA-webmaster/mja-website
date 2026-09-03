import Link from 'next/link'

export default function GetInvolved() {
  return (
    <section style={{ backgroundColor: '#0D1B2A' }} className="py-16 px-6">
      <div className="max-w-[1280px] mx-auto text-center">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: '#E8192C' }}>
          Get Involved
        </p>
        <h2 className="font-headline text-4xl font-black text-white mb-3">
          Reach out to MJA
        </h2>
        <p className="text-white/40 text-sm mb-10 max-w-md mx-auto leading-relaxed">
          Have a press freedom concern, a partnership idea, or a question for the Association? We want to hear from you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/connect"
            className="text-white px-10 py-3.5 rounded text-sm font-bold transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#E8192C' }}
          >
            Contact MJA
          </Link>
        </div>
      </div>
    </section>
  )
}
