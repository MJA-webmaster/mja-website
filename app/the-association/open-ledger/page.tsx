export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import AssociationSidebar from '@/components/AssociationSidebar'
import type { LedgerEntry } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Open Ledger' }

const CATEGORIES = ['Advocacy', 'Training', 'Administrative & Others'] as const

function formatMVR(n: number) {
  return `MVR ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default async function OpenLedgerPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('ledger_entries')
    .select('*')
    .order('entry_date', { ascending: false })

  const entries: LedgerEntry[] = data ?? []
  const hasEntries = entries.length > 0

  const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + Number(e.amount), 0)
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + Number(e.amount), 0)
  const balance = totalIncome - totalExpense

  const byCategory = CATEGORIES.map((cat) => ({
    category: cat,
    total: entries.filter(e => e.type === 'expense' && e.category === cat).reduce((sum, e) => sum + Number(e.amount), 0),
  }))

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="md:flex md:gap-16">
        <AssociationSidebar />
        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="font-headline font-black uppercase leading-none mb-2" style={{ color: '#0D1B2A', fontSize: 'clamp(32px, 4vw, 48px)' }}>
              <span style={{ color: '#E8192C' }}>Open</span> Ledger
            </h1>
            <p className="text-gray-500 text-[14px] leading-relaxed">
              MJA's income and expenditure, published for full financial transparency to our members and the public.
            </p>
          </div>

          {hasEntries && (
            <>
              {/* Summary ribbon */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-8 text-[13px] font-semibold text-gray-500">
                <span>Total Income <span style={{ color: '#059669' }}>{formatMVR(totalIncome)}</span></span>
                <span className="text-gray-300">•</span>
                <span>Total Expenses <span style={{ color: '#E8192C' }}>{formatMVR(totalExpense)}</span></span>
                <span className="text-gray-300">•</span>
                <span>Balance <span style={{ color: '#0D1B2A' }}>{formatMVR(balance)}</span></span>
              </div>

              {/* Spending by category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {byCategory.map((c) => (
                  <div key={c.category} className="border border-gray-100 rounded-xl p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">{c.category}</p>
                    <p className="font-headline text-2xl font-black" style={{ color: '#0D1B2A' }}>{formatMVR(c.total)}</p>
                  </div>
                ))}
              </div>

              {/* Ledger table */}
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-bold uppercase tracking-wide text-gray-400 border-b border-gray-100">
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Description</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(entry.entry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-3 text-navy font-medium">{entry.description}</td>
                        <td className="px-5 py-3 text-gray-500">{entry.category}</td>
                        <td className="px-5 py-3">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={
                              entry.type === 'income'
                                ? { backgroundColor: 'rgba(16,185,129,0.1)', color: '#059669' }
                                : { backgroundColor: 'rgba(232,25,44,0.1)', color: '#E8192C' }
                            }
                          >
                            {entry.type === 'income' ? 'Income' : 'Expense'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-navy whitespace-nowrap">
                          {entry.type === 'expense' ? '−' : '+'}{formatMVR(Number(entry.amount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!hasEntries && (
            <div className="text-center py-16 border border-gray-100 rounded-xl">
              <p className="font-bold text-navy text-sm mb-2">No financial disclosures published yet.</p>
              <p className="text-gray-500 text-[13px]">
                MJA's income and expenditure will appear here once the Secretariat publishes the first entries.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
