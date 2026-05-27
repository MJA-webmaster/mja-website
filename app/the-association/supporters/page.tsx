import { createClient } from '@/lib/supabase/server'
import AssociationSidebar from '@/components/AssociationSidebar'
import NewsletterForm from '@/components/NewsletterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Supporters' }

export default async function SupportersPage() {
  const supabase = createClient()
  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'supporters')
    .single()

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="flex gap-16">
          <AssociationSidebar />
          <div className="flex-1 min-w-0">
            <h1 className="font-headline text-4xl font-black uppercase mb-8" style={{ color: '#0D1B2A' }}>
              Our <span style={{ color: '#E8192C' }}>Supporters</span>
            </h1>
            {page?.content ? (
              <div
                className="article-content prose max-w-none text-[15px] leading-relaxed text-gray-600"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <p className="text-gray-400 text-sm">Content coming soon. Edit this page from the admin panel.</p>
            )}
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
