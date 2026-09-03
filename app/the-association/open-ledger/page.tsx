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
          <div className="grid md:grid-cols-2 gap-8 mb-10 items-start">
            <div>
              <h1 className="font-headline font-black uppercase leading-none mb-2" style={{ color: '#0D1B2A', fontSize: 'clamp(32px, 4vw, 48px)' }}>
                <span style={{ color: '#E8192C' }}>Open</span><br />
                Ledger
              </h1>
              <p className="text-gray-500 text-[14px] leading-relaxed mt-3">
                MJA's income and expenditure, published for full financial transparency to our members and the public.
              </p>
            </div>

            <div className="bg-navy rounded-xl p-8 text-white" style={{ backgroundColor: '#0D1B2A' }}>
              <p className="text-[11px] font-bold tracking-widest uppercase text-teal-400 mb-1">MJA</p>
              <p className="font-headline text-2xl font-bold mb-6">Summary</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-white/60 text-sm">Total Income</span>
                  <span className="font-headline text-xl font-black">{formatMVR(totalIncome)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-white/60 text-sm">Total Expenses</span>
                  <span className="font-headline text-xl font-black">{formatMVR(totalExpense)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Balance</span>
                  <span className="font-headline text-xl font-black" style={{ color: '#2DD4BF' }}>{formatMVR(balance)}</span>
                </div>
              </div>
            </div>
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
          {entries.length > 0 ? (
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
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="font-semibold text-sm">No ledger entries published yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
