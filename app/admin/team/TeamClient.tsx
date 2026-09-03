'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Pencil } from 'lucide-react'

type TeamMember = {
  id: string
  name: string
  position: string
  photo: string | null
  bio: string | null
  order: number
}

const emptyForm = { name: '', position: '', photo: '', bio: '', order: 0 }

export default function TeamClient({ team: initial }: { team: TeamMember[] }) {
  const [team, setTeam] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function openAddForm() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEditForm(member: TeamMember) {
    setEditingId(member.id)
    setForm({
      name: member.name,
      position: member.position,
      photo: member.photo ?? '',
      bio: member.bio ?? '',
      order: member.order,
    })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSave() {
    if (!form.name || !form.position) return
    setSaving(true)
    const supabase = createClient()
    const payload = {
      name: form.name, position: form.position,
      photo: form.photo || null, bio: form.bio || null,
      order: Number(form.order),
    }

    if (editingId) {
      const { data, error } = await supabase
        .from('team_members')
        .update(payload)
        .eq('id', editingId)
        .select().single()
      if (!error && data) {
        setTeam(prev => prev.map(m => (m.id === editingId ? data : m)).sort((a, b) => a.order - b.order))
        closeForm()
      }
    } else {
      const { data, error } = await supabase
        .from('team_members')
        .insert(payload)
        .select().single()
      if (!error && data) {
        setTeam(prev => [...prev, data].sort((a, b) => a.order - b.order))
        closeForm()
      }
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this team member?')) return
    const supabase = createClient()
    const { error } = await supabase.from('team_members').delete().eq('id', id)
    if (!error) setTeam(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">MJA Team</h1>
          <p className="text-gray-400 text-sm mt-1">{team.length} team members</p>
        </div>
        <button onClick={() => (showForm ? closeForm() : openAddForm())}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#E8192C' }}>
          <Plus size={16} /> Add Member
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-navy mb-4">{editingId ? 'Edit Team Member' : 'New Team Member'}</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { name: 'name', label: 'Full Name *', placeholder: 'Fathimath Ali' },
              { name: 'position', label: 'Position *', placeholder: 'e.g. Communications Manager' },
              { name: 'photo', label: 'Photo URL', placeholder: 'https://...' },
              { name: 'order', label: 'Display Order', placeholder: '0', type: 'number' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">{field.label}</label>
                <input type={field.type || 'text'} name={field.name} value={(form as any)[field.name]} onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none" />
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={2}
              placeholder="Short bio..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving || !form.name || !form.position}
              className="text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: '#E8192C' }}>
              {saving ? 'Saving...' : editingId ? 'Update' : 'Save'}
            </button>
            <button onClick={closeForm}
              className="border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {team.map((member) => (
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
                  <p className="text-sm font-semibold text-navy">{member.name}</p>
                  <p className="text-xs text-gray-400">{member.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => openEditForm(member)} className="text-gray-300 hover:text-navy transition-colors" title="Edit member">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(member.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Delete member">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {team.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">No team members yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
