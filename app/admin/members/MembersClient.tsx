'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Member } from '@/lib/types'
import { MEMBERSHIP_TYPES } from '@/lib/membership'
import { Plus, Trash2 } from 'lucide-react'

const categories = [
  { value: 'category-one', label: 'Category One' },
  { value: 'category-two', label: 'Category Two' },
  { value: 'category-three', label: 'Category Three' },
]

const emptyForm = {
  name: '',
  category: 'category-one' as Member['category'],
  membership_type: 'Professional' as Member['membership_type'],
  member_id: '',
  id_card_no: '',
  representing: '',
  years_in_journalism: '',
  photo: '',
  bio: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  twitter: '',
  member_since: '',
  fee_status: 'unpaid' as Member['fee_status'],
  fee_paid_until: '',
  is_active: true,
}

export default function MembersClient({ members: initial }: { members: Member[] }) {
  const [members, setMembers] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)

  const filtered = members.filter((m) => {
    const matchCat = filter === 'all' || m.membership_type === filter
    const term = search.toLowerCase()
    const matchSearch =
      m.name.toLowerCase().includes(term) ||
      (m.member_id ?? '').toLowerCase().includes(term) ||
      (m.id_card_no ?? '').toLowerCase().includes(term)
    return matchCat && matchSearch
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm({ ...form, [e.target.name]: val })
  }

  async function handleSave() {
    if (!form.name) return
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('members')
      .insert({
        name: form.name,
        category: form.category,
        membership_type: form.membership_type,
        member_id: form.member_id || null,
        id_card_no: form.id_card_no || null,
        representing: form.representing || null,
        years_in_journalism: form.years_in_journalism ? parseInt(form.years_in_journalism) : null,
        photo: form.photo || null,
        bio: form.bio || null,
        facebook: form.facebook || null,
        instagram: form.instagram || null,
        linkedin: form.linkedin || null,
        twitter: form.twitter || null,
        member_since: form.member_since || null,
        fee_status: form.fee_status,
        fee_paid_until: form.fee_paid_until || null,
        is_active: form.is_active,
      })
      .select()
      .single()

    if (error) {
      setError(error.message)
    } else if (data) {
      setMembers((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setForm(emptyForm)
      setShowForm(false)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this member?')) return
    const supabase = createClient()
    const { error } = await supabase.from('members').delete().eq('id', id)
    if (!error) setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  async function toggleActive(id: string, current: boolean) {
    const supabase = createClient()
    const { error } = await supabase.from('members').update({ is_active: !current }).eq('id', id)
    if (!error) {
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, is_active: !current } : m)))
    }
  }

  async function toggleFee(id: string, current: string) {
    const next = current === 'paid' ? 'unpaid' : 'paid'
    const supabase = createClient()
    const { error } = await supabase.from('members').update({ fee_status: next }).eq('id', id)
    if (!error) {
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, fee_status: next as Member['fee_status'] } : m))
      )
    }
  }

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none'
  const labelClass =
    'block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">Members</h1>
          <p className="text-gray-400 text-sm mt-1">
            {members.length} total · {members.filter((m) => m.fee_status === 'paid').length} paid
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#E8192C' }}
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-navy mb-4">New Member</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Ahmed Mohamed" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Membership Type</label>
              <select name="membership_type" value={form.membership_type} onChange={handleChange} className={inputClass}>
                {MEMBERSHIP_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Member ID</label>
              <input name="member_id" value={form.member_id} onChange={handleChange} placeholder="e.g. MJA-0042" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>ID Card No.</label>
              <input name="id_card_no" value={form.id_card_no} onChange={handleChange} placeholder="e.g. A123456" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Directory Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Representing</label>
              <input name="representing" value={form.representing} onChange={handleChange} placeholder="e.g. Mihaaru" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Years in Journalism</label>
              <input type="number" name="years_in_journalism" value={form.years_in_journalism} onChange={handleChange} placeholder="e.g. 10" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Photo URL</label>
              <input name="photo" value={form.photo} onChange={handleChange} placeholder="https://..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Member Since</label>
              <input type="date" name="member_since" value={form.member_since} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Fee Status</label>
              <select name="fee_status" value={form.fee_status} onChange={handleChange} className={inputClass}>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Fee Paid Until</label>
              <input type="date" name="fee_paid_until" value={form.fee_paid_until} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {error && <p className="text-sm mb-4" style={{ color: '#E8192C' }}>{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.name}
              className="text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: '#E8192C' }}
            >
              {saving ? 'Saving...' : 'Save Member'}
            </button>
            <button
              onClick={() => { setShowForm(false); setError(null) }}
              className="border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, member ID or ID card..."
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-navy focus:outline-none flex-1 max-w-xs"
        />
        <div className="flex gap-2">
          {['all', ...MEMBERSHIP_TYPES.map((t) => t.value)].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{
                backgroundColor: filter === f ? '#0D1B2A' : '#F3F4F6',
                color: filter === f ? 'white' : '#6B7280',
              }}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden overflow-x-auto">
        <div className="min-w-[860px]">
          <div className="grid grid-cols-[1fr_110px_110px_110px_90px_80px_60px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
            <span>Member</span>
            <span>Member ID</span>
            <span>Type</span>
            <span>Representing</span>
            <span>Fee</span>
            <span>Status</span>
            <span></span>
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-[1fr_110px_110px_110px_90px_80px_60px] gap-4 px-6 py-3.5 items-center"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {member.name[0]}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-navy truncate">{member.name}</p>
                </div>
                <span className="text-xs text-gray-500">{member.member_id || '—'}</span>
                <span className="text-xs text-gray-500">{member.membership_type || '—'}</span>
                <span className="text-xs text-gray-400 truncate">{member.representing || '—'}</span>
                <button onClick={() => toggleFee(member.id, member.fee_status)}>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      member.fee_status === 'paid'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {member.fee_status === 'paid' ? 'Paid' : 'Unpaid'}
                  </span>
                </button>
                <button onClick={() => toggleActive(member.id, member.is_active)}>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      member.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {member.is_active ? 'Active' : 'Inactive'}
                  </span>
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors flex justify-center"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-400 text-sm">No members found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
