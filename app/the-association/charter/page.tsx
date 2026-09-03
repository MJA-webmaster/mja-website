export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import AssociationSidebar from '@/components/AssociationSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'MJA Charter' }

export default async function CharterPage() {
  const supabase = createClient()
  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'charter')
    .single()

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="md:flex md:gap-16">
        <AssociationSidebar />
        <div className="flex-1 min-w-0 max-w-[860px]">
          <h1 className="font-headline font-black uppercase leading-none mb-8" style={{ color: '#0D1B2A', fontSize: 'clamp(32px, 4vw, 48px)' }}>
            <span style={{ color: '#E8192C' }}>MJA</span><br />
            Charter
          </h1>

          {page?.content ? (
            <div
              className="prose prose-neutral max-w-none prose-headings:font-headline prose-headings:text-navy prose-a:text-[#E8192C]"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <p className="text-gray-400 text-sm">The Charter has not been published yet. Check back soon.</p>
          )}
        </div>
      </div>
    </div>
  )
}
