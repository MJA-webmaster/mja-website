'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { LedgerEntry } from '@/lib/types'
import { Plus, Trash2, Download, FileText } from 'lucide-react'

const CATEGORIES = ['Advocacy', 'Training', 'Administrative & Others'] as const

const emptyForm = {
  entry_date: new Date().toISOString().slice(0, 10),
  type: 'expense' as LedgerEntry['type'],
  category: 'Advocacy' as LedgerEntry['category'],
  description: '',
  payee: '',
  amount: '',
}

const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none'
const labelClass = 'block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5'

function formatMVR(n: number) {
  return `MVR ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Escape a value for CSV (Zoho Books import accepts a plain comma-separated
// file — quote anything containing a comma, quote, or newline)
function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function downloadBlob(content: BlobPart, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function LedgerClient({ entries: initial }: { entries: LedgerEntry[] }) {
  const [entries, setEntries] = useState(initial)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const totalIncome = entries.filter(e => e.type === 'income').reduce((s, e) => s + Number(e.amount), 0)
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + Number(e.amount), 0)

  async function handleAdd() {
    if (!form.description.trim() || !form.amount) {
      setError('Description and amount are required')
      return
    }
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('ledger_entries')
      .insert({
        entry_date: form.entry_date,
        type: form.type,
        category: form.category,
        description: form.description.trim(),
        payee: form.payee.trim() || null,
        amount: Number(form.amount),
      })
      .select()
      .single()

    if (err || !data) {
      setError('Error saving entry')
    } else {
      setEntries(prev => [data as LedgerEntry, ...prev].sort((a, b) => b.entry_date.localeCompare(a.entry_date)))
      setForm(emptyForm)
      setShowForm(false)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this ledger entry?')) return
    const supabase = createClient()
    const { error: err } = await supabase.from('ledger_entries').delete().eq('id', id)
    if (!err) setEntries(prev => prev.filter(e => e.id !== id))
  }

  // Zoho Books' generic bank/transaction import expects columns roughly like:
  // Date, Description, Payee, Amount (signed), Category — this maps directly,
  // and Zoho's own import wizard lets you re-map column names on upload.
  function handleExportCSV() {
    const header = ['Date', 'Description', 'Payee', 'Category', 'Type', 'Amount']
    const rows = entries.map((e) => [
      e.entry_date,
      e.description,
      e.payee ?? '',
      e.category,
      e.type === 'income' ? 'Income' : 'Expense',
      (e.type === 'expense' ? -Number(e.amount) : Number(e.amount)).toFixed(2),
    ])
    const csv = [header, ...rows].map((r) => r.map(csvEscape).join(',')).join('\n')
    downloadBlob(csv, `mja-open-ledger-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;')
  }

  async function handleExportPDF() {
    const { default: jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text('MJA Open Ledger — Financial Summary', 14, 18)
    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128)
    doc.text(`Generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, 14, 25)

    doc.setFontSize(11)
    doc.setTextColor(13, 27, 42)
    doc.text(`Total Income: ${formatMVR(totalIncome)}`, 14, 35)
    doc.text(`Total Expenses: ${formatMVR(totalExpense)}`, 14, 41)
    doc.text(`Balance: ${formatMVR(totalIncome - totalExpense)}`, 14, 47)

    autoTable(doc, {
      startY: 55,
      head: [['Date', 'Description', 'Payee', 'Category', 'Type', 'Amount']],
      body: entries.map((e) => [
        new Date(e.entry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        e.description,
        e.payee ?? '—',
        e.category,
        e.type === 'income' ? 'Income' : 'Expense',
        `${e.type === 'expense' ? '−' : '+'}${formatMVR(Number(e.amount))}`,
      ]),
      headStyles: { fillColor: [13, 27, 42] },
      styles: { fontSize: 8 },
    })

    doc.save(`mja-open-ledger-${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-headline text-2xl font-bold text-navy">Open Ledger</h1>
          <p className="text-xs text-gray-400 mt-1">
            Income {formatMVR(totalIncome)} · Expenses {formatMVR(totalExpense)} · Balance {formatMVR(totalIncome - totalExpense)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={entries.length === 0}
            className="flex items-center gap-2 border border-gray-200 text-navy px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-40"
          >
            <Download size={15} /> Export CSV (Zoho)
          </button>
          <button
            onClick={handleExportPDF}
            disabled={entries.length === 0}
            className="flex items-center gap-2 border border-gray-200 text-navy px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-40"
          >
            <FileText size={15} /> Export PDF
          </button>
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#E8192C' }}
          >
            <Plus size={16} /> Add Entry
          </button>
        </div>
      </div>

      {showForm && (
        <div className="border border-gray-100 rounded-xl p-6 mb-6 grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date</label>
            <input type="date" className={inputClass} value={form.entry_date}
              onChange={(e) => setForm({ ...form, entry_date: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select className={inputClass} value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as LedgerEntry['type'] })}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select className={inputClass} value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as LedgerEntry['category'] })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Amount (MVR)</label>
            <input type="number" min="0" step="0.01" className={inputClass} value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Payee / Payer</label>
            <input className={inputClass} value={form.payee} placeholder="e.g. Ahmed Trading Pvt Ltd, or a donor's name"
              onChange={(e) => setForm({ ...form, payee: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <input className={inputClass} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          {error && <p className="md:col-span-2 text-xs font-semibold text-red-500">{error}</p>}
          <div className="md:col-span-2 flex justify-end gap-3">
            <button onClick={() => { setShowForm(false); setForm(emptyForm); setError('') }}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-500">Cancel</button>
            <button onClick={handleAdd} disabled={saving}
              className="text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: '#E8192C' }}>
              {saving ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-wide text-gray-400 border-b border-gray-100">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Payee</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                  {new Date(entry.entry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-5 py-3 text-navy font-medium">{entry.description}</td>
                <td className="px-5 py-3 text-gray-500">{entry.payee || '—'}</td>
                <td className="px-5 py-3 text-gray-500">{entry.category}</td>
                <td className="px-5 py-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={entry.type === 'income'
                      ? { backgroundColor: 'rgba(16,185,129,0.1)', color: '#059669' }
                      : { backgroundColor: 'rgba(232,25,44,0.1)', color: '#E8192C' }}>
                    {entry.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </td>
                <td className="px-5 py-3 text-right font-semibold text-navy whitespace-nowrap">
                  {entry.type === 'expense' ? '−' : '+'}{formatMVR(Number(entry.amount))}
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => handleDelete(entry.id)} className="text-gray-300 hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400 text-sm">No entries yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
