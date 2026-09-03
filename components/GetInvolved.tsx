import Link from 'next/link'

export default function GetInvolved() {
  return (
    <section style={{ backgroundColor: '#0D1B2A' }} className="py-16 px-6">
      <div className="max-w-[1280px] mx-auto text-center">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: '#E8192C' }}>
          Get Involved
        </p>
        <h2 className="font-headline text-4xl font-black text-white mb-3">
          Help defend press freedom
        </h2>
        <p className="text-white/40 text-sm mb-10 max-w-md mx-auto leading-relaxed">
          Support independent journalism and the rights of journalists across the Maldives.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/join-mja"
            className="text-white px-10 py-3.5 rounded text-sm font-bold transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#E8192C' }}
          >
            Become a Member
          </Link>
          <Link
            href="/connect"
            className="border border-white/20 text-white px-10 py-3.5 rounded text-sm font-bold hover:bg-white/5 transition-colors"
          >
            Contact MJA
          </Link>
        </div>
      </div>
    </section>
  )
}
