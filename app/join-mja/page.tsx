export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import JoinForm from '@/components/JoinForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join MJA',
  description: 'Become a member of the Maldives Journalists Association.',
}

export default async function JoinMJAPage() {
  return (
    <>
      {/* Page header — minimal, no hero */}
      <section className="border-b border-gray-100 py-12 px-6" style={{ backgroundColor: '#0D1B2A' }}>
        <div className="max-w-[760px] mx-auto">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: '#E8192C' }}>
            Membership
          </p>
          <h1 className="font-headline text-4xl md:text-5xl font-black text-white uppercase leading-tight mb-4">
            Become a Member
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-md">
            Fill in your details below and our team will review your application within 3 business days.
          </p>
        </div>
      </section>

      {/* What is MJA */}
      <section className="max-w-[760px] mx-auto px-6 py-12">
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

      {/* How contribution is used */}
      <section className="max-w-[760px] mx-auto px-6 py-12">
        <p className="text-lg font-light text-gray-400 mb-6">
          <strong style={{ color: '#E8192C' }}>How will</strong> your contribution be used?
        </p>
        <div className="space-y-8">
          {[
            {
              num: '1.',
              title: 'Fighting against censorship',
              body: 'MJA acts in cooperation with institutions and authorities to fight censorship and laws aimed at restricting freedom of information.',
            },
            {
              num: '2.',
              title: 'Supporting journalists',
              body: 'MJA provides material and legal aid to journalists needing urgent help, as well as to their families, continuously monitoring and denouncing attacks on press freedom.',
            },
            {
              num: '3.',
              title: 'Mobilizing the opinion',
              body: 'In urgent situations, MJA organizes symbolic actions and campaigns to bring public attention to threats against press freedom.',
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

      {/* Membership Acceptance Policy */}
      <section className="max-w-[760px] mx-auto px-6 py-12 border-t border-gray-100">
        <h2 className="font-headline text-2xl font-black text-navy mb-4 uppercase">
          Membership Acceptance Policy
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          By submitting this form, you certify that all information and documentation provided are accurate,
          and you agree to adhere to the MJA Constitution, Code of Ethics, and Membership Policy (MJA/U-01/2022).
        </p>
      </section>

      {/* Membership Form — this is the anchor */}
      <section className="bg-gray-50 py-16 px-6" id="form">
        <div className="max-w-[640px] mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase mb-2 text-center" style={{ color: '#E8192C' }}>
            Apply Now
          </p>
          <h2 className="font-headline text-3xl font-black text-navy text-center mb-2">
            Membership Application
          </h2>
          <p className="text-gray-400 text-sm text-center mb-10">
            Our team will review your application and respond within 3 business days.
          </p>
          <JoinForm />
        </div>
      </section>
    </>
  )
}
