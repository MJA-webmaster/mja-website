import Link from 'next/link'

export default function GetInvolved() {
  return (
    <section style={{ backgroundColor: '#0D1B2A' }} className="py-16 px-6">
      <div className="max-w-[1280px] mx-auto text-center">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: '#E8192C' }}>
          Get Involved
        </p>
        <h2 className="font-headline text-4xl font-black text-white mb-3">
          Stay informed, stay engaged
        </h2>
        <p className="text-white/40 text-sm mb-10 max-w-md mx-auto leading-relaxed">
          Explore MJA's reports, publications, and press freedom resources for journalists across the Maldives.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/resource-hub"
            className="text-white px-10 py-3.5 rounded text-sm font-bold transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#E8192C' }}
          >
            Explore Resource Hub
          </Link>
        </div>
      </div>
    </section>
  )
}
