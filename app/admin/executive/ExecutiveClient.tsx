'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Star } from 'lucide-react'

type ExecMember = {
  id: string
  name: string
  role: string
  is_president: boolean
  representing: string | null
  years_in_journalism: number | null
  photo: string | null
  bio: string | null
  order: number
}

const emptyForm = {
  name: '', role: '', is_president: false,
  representing: '', years_in_journalism: '',
  photo: '', bio: '', order: 0,
}

export default function ExecutiveClient({ members: initial }: { members: ExecMember[] }) {
  const [members, setMembers] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm({ ...form, [e.target.name]: val })
  }

  async function handleSave() {
    if (!form.name || !form.role) return
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('executive_committee')
      .insert({
        name: form.name, role: form.role,
        is_president: form.is_president,
        representing: form.representing || null,
        years_in_journalism: form.years_in_journalism ? parseInt(form.years_in_journalism as string) : null,
        photo: form.photo || null,
        bio: form.bio || null,
        order: form.order,
      })
      .select().single()

    if (!error && data) {
      setMembers(prev => [...prev, data].sort((a, b) => a.order - b.order))
      setForm(emptyForm)
      setShowForm(false)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this member?')) return
    const supabase = createClient()
    const { error } = await supabase.from('executive_committee').delete().eq('id', id)
    if (!error) setMembers(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">Executive Committee</h1>
          <p className="text-gray-400 text-sm mt-1">{members.length} members</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#E8192C' }}>
          <Plus size={16} /> Add Member
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-navy mb-4">New Executive Member</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { name: 'name', label: 'Full Name *', placeholder: 'Ahmed Mohamed' },
              { name: 'role', label: 'Role *', placeholder: 'e.g. Vice President' },
              { name: 'representing', label: 'Representing', placeholder: 'e.g. Mihaaru' },
              { name: 'years_in_journalism', label: 'Years in Journalism', placeholder: '10', type: 'number' },
              { name: 'photo', label: 'Photo URL', placeholder: 'https://...' },
              { name: 'order', label: 'Display Order', placeholder: '0', type: 'number' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={(form as any)[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none"
                />
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
              placeholder="Short biography..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none resize-none" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer mb-4">
            <input type="checkbox" name="is_president" checked={form.is_president} onChange={handleChange} style={{ accentColor: '#E8192C' }} />
            This person is the President
          </label>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving || !form.name || !form.role}
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

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400">{member.name[0]}</div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-navy">{member.name}</p>
                    {member.is_president && <Star size={12} fill="#E8192C" stroke="none" />}
                  </div>
                  <p className="text-xs text-gray-400">{member.role}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(member.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {members.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">No members yet. Add the first one above.</div>
          )}
        </div>
      </div>
    </div>
  )
}
