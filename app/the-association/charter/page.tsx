import { createClient } from '@/lib/supabase/server'
import AssociationSidebar from '@/components/AssociationSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'MJA Charter' }
export const dynamic = 'force-dynamic'

export default async function CharterPage() {
  const supabase = createClient()
  const { data: doc } = await supabase
    .from('resources')
    .select('*')
    .eq('category', 'governance')
    .eq('title', 'MJA Charter')
    .eq('published', true)
    .maybeSingle()

  const fileUrl = doc?.file_url ?? '/mja-charter.pdf'

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="md:flex md:gap-16">
        <AssociationSidebar />
        <div className="flex-1 min-w-0 max-w-[860px]">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h1 className="font-headline font-black uppercase leading-none" style={{ color: '#0D1B2A', fontSize: 'clamp(32px, 4vw, 48px)' }}>
              <span style={{ color: '#E8192C' }}>MJA</span><br />
              Charter
            </h1>
            
              href={fileUrl}
              download
              className="inline-block text-white font-semibold px-6 py-3 rounded text-sm transition-opacity hover:opacity-85 whitespace-nowrap"
              style={{ backgroundColor: '#E8192C' }}
            >
              Download PDF
            </a>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-100" style={{ height: '80vh' }}>
            <object data={fileUrl} type="application/pdf" width="100%" height="100%">
              <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 bg-gray-50">
                <p className="text-gray-400 text-sm mb-4">
                  Your browser can&apos;t preview the PDF here.
                </p>
                
                  href={fileUrl}
                  className="inline-block text-white font-semibold px-6 py-3 rounded text-sm transition-opacity hover:opacity-85"
                  style={{ backgroundColor: '#E8192C' }}
                >
                  Open the Charter
                </a>
              </div>
            </object>
          </div>
        </div>
      </div>
    </div>
  )
}
