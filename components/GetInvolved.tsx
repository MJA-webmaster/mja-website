import Link from 'next/link'

export default function GetInvolved() {
  return (
    <section className="bg-navy py-16 px-6 relative overflow-hidden">
      {/* BG letter */}
      <div className="absolute left-0 top-0 font-headline font-black text-[300px] leading-none text-white/5 select-none">M</div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        <h2 className="font-headline text-4xl font-black text-white text-right mb-10">Get Involved</h2>

        {/* Twitter-style cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            '#WorldPressFreedomDay is not a day for us to pat ourselves in the back. It\'s a day when we reflect and reaffirm the values essential for a free press.',
            '#WorldPressFreedomDay is not a day for us to pat ourselves in the back. It\'s a day when we commit ourselves to independent, investigative journalism.',
            '#WorldPressFreedomDay reminds us that freedom of press is not a given. We must fight for it every single day.',
          ].map((text, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-5 border border-white/10">
              <p className="text-white/50 text-xs mb-3">@theguytweetualways</p>
              <p className="text-white/80 text-sm leading-relaxed">{text}</p>
              <div className="flex gap-4 mt-4">
                <button className="text-white/30 hover:text-white transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M17 1l4 4-4 4"/>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                    <path d="M7 23l-4-4 4-4"/>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                </button>
                <button className="text-white/30 hover:text-red transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-white/40 text-center text-sm mb-8">Help defend freedom of information every day</p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/join-mja" className="border border-white/30 text-white px-10 py-3.5 rounded text-sm font-bold hover:bg-white/10 transition-colors">
            Make a Donation
          </Link>
          <Link href="/join-mja" className="border border-white/30 text-white px-10 py-3.5 rounded text-sm font-bold hover:bg-white/10 transition-colors">
            Become a Member
          </Link>
          <Link href="/shop" className="border border-white/30 text-white px-10 py-3.5 rounded text-sm font-bold hover:bg-white/10 transition-colors">
            Visit the Shop
          </Link>
        </div>
      </div>
    </section>
  )
}
