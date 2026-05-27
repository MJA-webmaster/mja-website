'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Member } from '@/lib/types'
import { Plus, Trash2, UserCheck } from 'lucide-react'

const categories = [
  { value: 'category-one', label: 'Category One' },
  { value: 'category-two', label: 'Category Two' },
  { value: 'category-three', label: 'Category Three' },
]

const emptyForm = {
  name: '',
  category: 'category-one' as Member['category'],
  representing: '',
  years_in_journalism: '',
  photo: '',
  bio: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  twitter: '',
  member_since: '',
  is_active: true,
}

export default function MembersClient({ members: initial }: { members: Member[] }) {
  const [members, setMembers] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)

  const filtered = members.filter(m => {
    const matchCat = filter === 'all' || m.category === filter
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm({ ...form, [e.target.name]: val })
  }

  async function handleSave() {
    if (!form.name) return
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('members')
      .insert({
        name: form.name,
        category: form.category,
        representing: form.representing || null,
        years_in_journalism: form.years_in_journalism ? parseInt(form.years_in_journalism) : null,
        photo: form.photo || null,
        bio: form.bio || null,
        facebook: form.facebook || null,
        instagram: form.instagram || null,
        linkedin: form.linkedin || null,
        twitter: form.twitter || null,
        member_since: form.member_since || null,
        is_active: form.is_active,
      })
      .select()
      .single()

    if (!error && data) {
      setMembers(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setForm(emptyForm)
      setShowForm(false)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this member?')) return
    const supabase = createClient()
    const { error } = await supabase.from('members').delete().eq('id', id)
    if (!error) setMembers(prev => prev.filter(m => m.id !== id))
  }

  async function toggleActive(id: string, current: boolean) {
    const supabase = createClient()
    const { error } = await supabase.from('members').update({ is_active: !current }).eq('id', id)
    if (!error) setMembers(prev => prev.map(m => m.id === id ? { ...m, is_active: !current } : m))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">Members</h1>
          <p className="text-gray-400 text-sm mt-1">{members.length} total members</p>
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
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Ahmed Mohamed"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none">
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Representing</label>
              <input name="representing" value={form.representing} onChange={handleChange} placeholder="e.g. Mihaaru"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Years in Journalism</label>
              <input type="number" name="years_in_journalism" value={form.years_in_journalism} onChange={handleChange} placeholder="e.g. 10"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Photo URL</label>
              <input name="photo" value={form.photo} onChange={handleChange} placeholder="https://..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Member Since</label>
              <input type="date" name="member_since" value={form.member_since} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving || !form.name}
              className="text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: '#E8192C' }}>
              {saving ? 'Saving...' : 'Save Member'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members..."
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-navy focus:outline-none flex-1 max-w-xs"
        />
        <div className="flex gap-2">
          {['all', ...categories.map(c => c.value)].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors"
              style={{ backgroundColor: filter === f ? '#0D1B2A' : '#F3F4F6', color: filter === f ? 'white' : '#6B7280' }}>
              {f === 'all' ? 'All' : categories.find(c => c.value === f)?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_100px_80px_60px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
          <span>Member</span>
          <span>Category</span>
          <span>Representing</span>
          <span>Status</span>
          <span></span>
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.map((member) => (
            <div key={member.id} className="grid grid-cols-[1fr_120px_100px_80px_60px] gap-4 px-6 py-3.5 items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">{member.name[0]}</div>
                  )}
                </div>
                <p className="text-sm font-semibold text-navy">{member.name}</p>
              </div>
              <span className="text-xs text-gray-500 capitalize">{member.category.replace('-', ' ')}</span>
              <span className="text-xs text-gray-400">{member.representing || '—'}</span>
              <button onClick={() => toggleActive(member.id, member.is_active)}>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${member.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {member.is_active ? 'Active' : 'Inactive'}
                </span>
              </button>
              <button onClick={() => handleDelete(member.id)} className="text-gray-300 hover:text-red-500 transition-colors flex justify-center">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              No members found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
