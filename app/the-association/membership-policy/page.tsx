import { createClient } from '@/lib/supabase/server'
import AssociationSidebar from '@/components/AssociationSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Membership Policy' }
export const dynamic = 'force-dynamic'

export default async function MembershipPolicyPage() {
  const supabase = createClient()
  const { data: doc } = await supabase
    .from('resources')
    .select('*')
    .eq('category', 'governance')
    .eq('title', 'Membership Policy')
    .eq('published', true)
    .maybeSingle()

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="md:flex md:gap-16">
        <AssociationSidebar />
        <div className="flex-1 min-w-0 max-w-[860px]">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h1 className="font-headline font-black uppercase leading-none" style={{ color: '#0D1B2A', fontSize: 'clamp(32px, 4vw, 48px)' }}>
              Membership<br />
              <span style={{ color: '#E8192C' }}>Policy</span>
            </h1>
            {doc?.file_url && (
              <a
                href={doc.file_url}
                download
                className="inline-block text-white font-semibold px-6 py-3 rounded text-sm transition-opacity hover:opacity-85 whitespace-nowrap"
                style={{ backgroundColor: '#E8192C' }}
              >
                Download PDF
              </a>
            )}
          </div>

          {doc?.file_url ? (
            <div className="rounded-xl overflow-hidden border border-gray-100" style={{ height: '80vh' }}>
              <object data={doc.file_url} type="application/pdf" width="100%" height="100%">
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 bg-gray-50">
                  <p className="text-gray-400 text-sm mb-4">
                    Your browser can&apos;t preview the PDF here.
                  </p>
                  <a
                    href={doc.file_url}
                    className="inline-block text-white font-semibold px-6 py-3 rounded text-sm transition-opacity hover:opacity-85"
                    style={{ backgroundColor: '#E8192C' }}
                  >
                    Open the Policy
                  </a>
                </div>
              </object>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl">
              <p className="text-4xl mb-3">📄</p>
              <p className="font-semibold text-sm">Membership Policy will appear here once uploaded</p>
              <p className="text-xs mt-1">Add it via Admin → Resources</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
