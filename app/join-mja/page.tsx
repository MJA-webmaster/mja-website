import { createClient } from '@/lib/supabase/server'
import MemberMeter from '@/components/MemberMeter'
import NewsletterForm from '@/components/NewsletterForm'
import JoinForm from '@/components/JoinForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join MJA',
  description: 'Become a member of the Maldives Journalists Association and be the voice for freedom of press.',
}

export default async function JoinMJAPage() {
  const supabase = createClient()
  const { data: stats } = await supabase.from('member_stats').select('*').single()

  const memberStats = stats
    ? { ...stats, total: stats.local + stats.international + stats.non_member_contributors }
    : { local: 2000, international: 1300, non_member_contributors: 560, total: 3860 }

  return (
    <>
      {/* Hero */}
      <section className="grid md:grid-cols-2 min-h-[420px]">
        {/* Left — dark with mic */}
        <div className="bg-navy text-white p-12 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-5 select-none pointer-events-none">
            <svg viewBox="0 0 200 280" className="w-64 h-80" fill="none">
              <rect x="70" y="20" width="60" height="120" rx="30" fill="white"/>
              <line x1="100" y1="140" x2="100" y2="190" stroke="white" strokeWidth="8"/>
              <line x1="65" y1="190" x2="135" y2="190" stroke="white" strokeWidth="8" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">
            Maldives Journalists Association
          </p>
          <h1 className="font-headline text-5xl md:text-6xl font-black leading-none mb-6">
            Be the <span style={{ color: '#E8192C' }}>voice</span><br />
            for freedom<br />
            of press
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            Join thousands of journalists across the Maldives and the world defending the right to free press.
          </p>
        </div>

        {/* Right — red */}
        <div className="flex flex-col justify-center p-12 relative overflow-hidden" style={{ backgroundColor: '#E8192C' }}>
          <div className="absolute font-headline font-black text-white/10 text-[200px] leading-none -bottom-8 -right-4 select-none">M</div>
          <div className="relative z-10">
            <p className="text-white/70 text-xs font-bold tracking-widest uppercase mb-3">Membership</p>
            <h2 className="font-headline text-4xl font-black text-white uppercase leading-tight mb-4">
              Join MJA<br />Today
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-sm">
              By becoming a member, you directly support journalists across the Maldives and contribute to the fight for press freedom.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="#membership-form"
                className="bg-white font-semibold px-8 py-3 rounded text-sm hover:bg-white/90 transition-colors"
                style={{ color: '#E8192C' }}
              >
                Apply Now
              </a>
              <a
                href="#contribution"
                className="border border-white/40 text-white px-8 py-3 rounded text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Be the Voice + Membermeter */}
      <section className="max-w-[1280px] mx-auto px-6 py-16 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#E8192C' }}>
            Be the Voice
          </p>
          <h2 className="font-headline text-4xl md:text-5xl font-black uppercase leading-none mb-6" style={{ color: '#0D1B2A' }}>
            For Freedom<br />of Press
          </h2>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-4">
            Freedom of information is the foundation of any democracy. Yet almost half of the world's population is still denied it. By becoming a member of MJA, you can support the integrity of journalism in every corner of the globe.
          </p>
          <p className="text-gray-500 text-[15px] leading-relaxed">
            We all share the right to freedom of information. We need you to help us defend it. Join us!
          </p>
        </div>
        <MemberMeter stats={memberStats} />
      </section>

      <hr className="border-gray-100 mx-6" />

      {/* What is MJA */}
      <section className="max-w-[760px] mx-auto px-6 py-14" id="about">
        <p className="text-lg font-light text-gray-400 mb-2">
          <strong style={{ color: '#E8192C' }}>What is</strong> Maldives Journalists Association?
        </p>
        <p className="text-gray-500 text-[15px] leading-relaxed mb-4">
          Maldives Journalists Association is one of the leading independent organizations dedicated to promoting and defending freedom of information in the Maldives. Thanks to its network of active correspondents and members, MJA strives daily to maintain a free press in every corner of the country.
        </p>
        <p className="text-gray-500 text-[15px] leading-relaxed">
          Registered as a non-profit organization, it has consultative status with key international bodies and advocates for the rights of journalists at every level.
        </p>
      </section>

      <hr className="border-gray-100 mx-6" />

      {/* How will your contribution be used */}
      <section className="max-w-[760px] mx-auto px-6 py-14" id="contribution">
        <p className="text-lg font-light text-gray-400 mb-2">
          <strong style={{ color: '#E8192C' }}>How will</strong> your contribution be used?
        </p>
        <p className="text-gray-500 text-[15px] leading-relaxed mb-4">
          By donating to MJA, you are directly supporting journalists across the Maldives who have been silenced through intimidation, legal threats, and suppression.
        </p>
        <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
          Your contribution goes towards:
        </p>

        <div className="space-y-8">
          {[
            {
              num: '1.',
              title: 'Fighting against censorship',
              body: 'MJA acts in cooperation with institutions and authorities to fight censorship and laws aimed at restricting freedom of information. In some cases, a delegation follows it up with direct engagement to gain more insight into the working conditions of journalists.',
            },
            {
              num: '2.',
              title: 'Supporting journalists',
              body: 'MJA provides material and legal aid to journalists needing urgent help, as well as to their families. To promote and defend information freedom, MJA continuously monitors and denounces attacks on freedom of information nationwide.',
            },
            {
              num: '3.',
              title: 'Mobilizing the opinion',
              body: 'In urgent situations and on the occasion of key national events, MJA organizes symbolic actions and campaigns to bring public attention to threats against press freedom.',
            },
          ].map((item) => (
            <div key={item.num} className="grid grid-cols-[40px_1fr] gap-4">
              <div className="font-headline text-3xl font-black" style={{ color: '#E8192C' }}>
                {item.num}
              </div>
              <div>
                <h3 className="font-bold text-navy text-[16px] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-[14px] leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100 mx-6" />

      {/* What do I receive */}
      <section className="max-w-[760px] mx-auto px-6 py-14">
        <p className="text-lg font-light text-gray-400 mb-2">
          <strong style={{ color: '#E8192C' }}>What do I</strong> receive as a member?
        </p>
        <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
          All members receive official recognition and access to MJA resources. Sponsorship-level members receive additional benefits including a membership card and the Press Freedom publication.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            { icon: '🎫', title: 'Membership Card', body: 'Official MJA membership card recognizing your commitment to press freedom.' },
            { icon: '🗺️', title: 'Press Freedom Map', body: 'Annual publication showing the state of journalism and press freedom.' },
            { icon: '📰', title: 'Resource Access', body: 'Exclusive access to MJA publications, directories, and press freedom reports.' },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl p-6 border-t-4 shadow-sm hover:shadow-md transition-shadow"
              style={{ borderTopColor: '#E8192C' }}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h4 className="font-bold text-navy text-[15px] mb-2">{card.title}</h4>
              <p className="text-gray-400 text-[13px] leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Membership Form */}
      <section className="bg-gray-50 py-16 px-6" id="membership-form">
        <div className="max-w-[640px] mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase mb-2 text-center" style={{ color: '#E8192C' }}>
            Apply Now
          </p>
          <h2 className="font-headline text-3xl font-black text-navy text-center mb-2">
            Become a Member
          </h2>
          <p className="text-gray-400 text-sm text-center mb-10">
            Fill in your details and our team will get back to you within 3 business days.
          </p>
          <JoinForm />
        </div>
      </section>

      {/* Newsletter */}
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
