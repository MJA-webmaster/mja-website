'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Member } from '@/lib/types'
import { MEMBERSHIP_TYPES } from '@/lib/membership'
import ImageUpload from '@/components/ImageUpload'
import { Plus, Trash2 } from 'lucide-react'

type Application = {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  message: string | null
  membership_type: string | null
  full_name: string | null
  common_name: string | null
  id_card_no: string | null
  email: string
  mobile_no: string | null
  employment_type: string | null
  nature_of_work: string | null
  workplace_name: string | null
  designation: string | null
  atoll_island: string | null
  photo_url: string | null
  id_card_url: string | null
  portfolio_url: string | null
  type: string | null
  name: string | null
  phone: string | null
  outlet: string | null
  years_in_journalism: number | null
}

const statusColors = {
  pending: { bg: 'rgba(245,158,11,0.1)', color: '#D97706', label: 'Pending' },
  approved: { bg: 'rgba(16,185,129,0.1)', color: '#059669', label: 'Approved' },
  rejected: { bg: 'rgba(232,25,44,0.1)', color: '#E8192C', label: 'Rejected' },
}

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

const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none'
const labelClass = 'block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5'

function displayName(a: Application) {
  return a.full_name || a.name || 'Unnamed applicant'
}

function displayType(a: Application) {
  return a.membership_type || a.type || '—'
}

function DocLink({ href, label }: { href: string; label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
      className="block text-sm font-semibold text-left"
      style={{ color: '#E8192C' }}
    >
      {label} ↗
    </button>
  )
}

function ApplicationsTab({
  applications: initial,
  onApproved,
}: {
  applications: Application[]
  onApproved: (member: Member) => void
}) {
  const [applications, setApplications] = useState(initial)
  const [selected, setSelected] = useState<Application | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [updating, setUpdating] = useState(false)
  const [docLinks, setDocLinks] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<string | null>(null)

  const filtered = filter === 'all' ? applications : applications.filter((a) => a.status === filter)
  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  }

  useEffect(() => {
    if (!selected) return
    const paths: [string, string | null][] = [
      ['photo', selected.photo_url],
      ['idCard', selected.id_card_url],
      ['portfolio', selected.portfolio_url],
    ]
    const present = paths.filter(([, p]) => Boolean(p)) as [string, string][]
    if (present.length === 0) { setDocLinks({}); return }
    let cancelled = false
    const supabase = createClient()
    Promise.all(
      present.map(async ([key, path]) => {
        const { data } = await supabase.storage.from('membership-docs').createSignedUrl(path, 600)
        return [key, data?.signedUrl ?? ''] as const
      })
    ).then((pairs) => {
      if (cancelled) return
      setDocLinks(Object.fromEntries(pairs.filter(([, url]) => url)))
    })
    return () => { cancelled = true }
  }, [selected])

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    setUpdating(true)
    const supabase = createClient()
    const { error } = await supabase.from('membership_applications').update({ status }).eq('id', id)
    if (!error) {
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
      if (selected?.id === id) setSelected((prev) => (prev ? { ...prev, status } : null))
      if (status === 'approved') {
        await new Promise((r) => setTimeout(r, 800))
        const app = applications.find((a) => a.id === id)
        if (app?.id_card_no) {
          const { data } = await supabase.from('members').select('*').eq('id_card_no', app.id_card_no).single()
          if (data) onApproved(data as Member)
        }
        setToast('Approved — member added. Assign a Member ID in the Members tab.')
        setTimeout(() => setToast(null), 6000)
      }
    }
    setUpdating(false)
  }

  const isCorporate = selected?.membership_type === 'Corporate'
  const detailRows = selected ? [
    { label: isCorporate ? 'Contact Person' : 'Common Name', value: selected.common_name },
    { label: isCorporate ? 'Registration No.' : 'ID Card No.', value: selected.id_card_no },
    { label: 'Email', value: selected.email },
    { label: 'Mobile', value: selected.mobile_no || selected.phone },
    { label: 'Employment Type', value: selected.employment_type },
    { label: 'Nature of Work', value: selected.nature_of_work },
    { label: 'Workplace', value: selected.workplace_name || selected.outlet },
    { label: 'Designation', value: selected.designation },
    { label: 'Atoll / Island', value: selected.atoll_island },
    { label: 'Applied', value: new Date(selected.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
  ].filter((r) => Boolean(r.value)) : []

  const docs = selected ? [
    { key: 'photo', label: isCorporate ? 'Organisation logo' : 'Passport photo' },
    { key: 'idCard', label: isCorporate ? 'Registration certificate' : 'ID card copy' },
    { key: 'portfolio', label: 'Portfolio' },
  ].filter((d) => docLinks[d.key]) : []

  return (
    <div>
      {toast && (
        <div className="mb-4 px-5 py-3 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)' }}>
          {toast}
        </div>
      )}
      <div className="flex gap-2 mb-5">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors"
            style={{ backgroundColor: filter === f ? '#0D1B2A' : '#F3F4F6', color: filter === f ? 'white' : '#6B7280' }}>
            {f} <span className="ml-1 text-xs opacity-60">({counts[f]})</span>
          </button>
        ))}
      </div>
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-[1fr_110px_110px_90px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
              <span>Applicant</span><span>Type</span><span>Date</span><span>Status</span>
            </div>
            <div className="divide-y divide-gray-50">
              {filtered.map((app) => {
                const s = statusColors[app.status]
                return (
                  <button key={app.id} onClick={() => setSelected(app)}
                    className="w-full grid grid-cols-[1fr_110px_110px_90px] gap-4 px-5 py-4 hover:bg-gray-50 transition-colors items-center text-left"
                    style={selected?.id === app.id ? { backgroundColor: 'rgba(232,25,44,0.03)' } : {}}>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy truncate">{displayName(app)}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{app.email}</p>
                    </div>
                    <span className="text-xs text-gray-500">{displayType(app)}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full font-semibold w-fit"
                      style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                  </button>
                )
              })}
              {filtered.length === 0 && (
                <div className="px-5 py-12 text-center text-gray-400 text-sm">No {filter === 'all' ? '' : filter} applications yet.</div>
              )}
            </div>
          </div>
        </div>
        {selected && (
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-6">
              <div className="p-5 border-b border-gray-100 flex items-start justify-between">
                <div className="min-w-0">
                  <h2 className="font-bold text-navy truncate">{displayName(selected)}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{displayType(selected)} membership</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 text-lg leading-none ml-2">×</button>
              </div>
              <div className="p-5 space-y-3 max-h-[50vh] overflow-y-auto">
                {detailRows.map((item) => (
                  <div key={item.label}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{item.label}</p>
                    <p className="text-sm text-navy break-words">{item.value}</p>
                  </div>
                ))}
                {selected.message && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Message</p>
                    <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">{selected.message}</p>
                  </div>
                )}
                {docs.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Documents</p>
                    <div className="space-y-1.5">
                      {docs.map((d) => <DocLink key={d.key} href={docLinks[d.key]} label={d.label} />)}
                    </div>
                    <p className="text-[10px] text-gray-300 mt-1.5">Links expire after 10 minutes.</p>
                  </div>
                )}
              </div>
              <div className="px-5 pb-3">
                <div className="text-xs px-3 py-1.5 rounded-full font-semibold w-fit"
                  style={{ backgroundColor: statusColors[selected.status].bg, color: statusColors[selected.status].color }}>
                  {statusColors[selected.status].label}
                </div>
              </div>
              {selected.status === 'pending' ? (
                <div className="p-5 border-t border-gray-100 flex gap-2">
                  <button onClick={() => updateStatus(selected.id, 'approved')} disabled={updating}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                    style={{ backgroundColor: '#059669' }}>
                    {updating ? 'Saving...' : 'Approve'}
                  </button>
                  <button onClick={() => updateStatus(selected.id, 'rejected')} disabled={updating}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                    style={{ backgroundColor: '#E8192C' }}>
                    Reject
                  </button>
                </div>
              ) : (
                <div className="p-5 border-t border-gray-100">
                  <button onClick={() => updateStatus(selected.id, selected.status === 'approved' ? 'rejected' : 'approved')}
                    disabled={updating}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                    Change to {selected.status === 'approved' ? 'Rejected' : 'Approved'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MembersTab({ members: initial }: { members: Member[] }) {
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
    return matchCat && (
      m.name.toLowerCase().includes(term) ||
      (m.member_id ?? '').toLowerCase().includes(term) ||
      (m.id_card_no ?? '').toLowerCase().includes(term)
    )
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm({ ...form, [e.target.name]: val })
  }

  async function handleSave() {
    if (!form.name) return
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const { data, error } = await supabase.from('members').insert({
      name: form.name, category: form.category, membership_type: form.membership_type,
      member_id: form.member_id || null, id_card_no: form.id_card_no || null,
      representing: form.representing || null,
      years_in_journalism: form.years_in_journalism ? parseInt(form.years_in_journalism) : null,
      photo: form.photo || null, bio: form.bio || null,
      facebook: form.facebook || null, instagram: form.instagram || null,
      linkedin: form.linkedin || null, twitter: form.twitter || null,
      member_since: form.member_since || null, fee_status: form.fee_status,
      fee_paid_until: form.fee_paid_until || null, is_active: form.is_active,
    }).select().single()
    if (error) { setError(error.message) }
    else if (data) {
      setMembers((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setForm(emptyForm); setShowForm(false)
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
    await supabase.from('members').update({ is_active: !current }).eq('id', id)
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, is_active: !current } : m)))
  }

  async function toggleFee(id: string, current: string) {
    const next = current === 'paid' ? 'unpaid' : 'paid'
    const supabase = createClient()
    await supabase.from('members').update({ fee_status: next }).eq('id', id)
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, fee_status: next as Member['fee_status'] } : m)))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-gray-400 text-sm">{members.length} total · {members.filter((m) => m.fee_status === 'paid').length} paid</p>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#E8192C' }}>
          <Plus size={16} /> Add Member
        </button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-navy">New Member</h2>
            <button onClick={() => { setShowForm(false); setError(null) }} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
          </div>
          <div className="flex gap-6 mb-4">
            <div className="w-40 flex-shrink-0">
              <ImageUpload label="Photo" value={form.photo} folder="members" onChange={(url) => setForm({ ...form, photo: url })} />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Full Name *</label><input name="name" value={form.name} onChange={handleChange} placeholder="Ahmed Mohamed" className={inputClass} /></div>
              <div><label className={labelClass}>Membership Type</label>
                <select name="membership_type" value={form.membership_type} onChange={handleChange} className={inputClass}>
                  {MEMBERSHIP_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Member ID</label><input name="member_id" value={form.member_id} onChange={handleChange} placeholder="e.g. MJA-0042" className={inputClass} /></div>
              <div><label className={labelClass}>ID Card No.</label><input name="id_card_no" value={form.id_card_no} onChange={handleChange} placeholder="e.g. A123456" className={inputClass} /></div>
              <div><label className={labelClass}>Directory Category</label>
                <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                  {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Representing</label><input name="representing" value={form.representing} onChange={handleChange} placeholder="e.g. Mihaaru" className={inputClass} /></div>
              <div><label className={labelClass}>Member Since</label><input type="date" name="member_since" value={form.member_since} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Fee Status</label>
                <select name="fee_status" value={form.fee_status} onChange={handleChange} className={inputClass}>
                  <option value="unpaid">Unpaid</option><option value="paid">Paid</option>
                </select>
              </div>
              <div><label className={labelClass}>Fee Paid Until</label><input type="date" name="fee_paid_until" value={form.fee_paid_until} onChange={handleChange} className={inputClass} /></div>
            </div>
          </div>
          {error && <p className="text-sm mb-4" style={{ color: '#E8192C' }}>{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving || !form.name}
              className="text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: '#E8192C' }}>
              {saving ? 'Saving...' : 'Save Member'}
            </button>
            <button onClick={() => { setShowForm(false); setError(null) }}
              className="border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, member ID or ID card..."
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-navy focus:outline-none flex-1 max-w-xs" />
        <div className="flex flex-wrap gap-2">
          {['all', ...MEMBERSHIP_TYPES.map((t) => t.value)].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ backgroundColor: filter === f ? '#0D1B2A' : '#F3F4F6', color: filter === f ? 'white' : '#6B7280' }}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[1fr_110px_110px_110px_90px_80px_60px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
            <span>Member</span><span>Member ID</span><span>Type</span><span>Representing</span><span>Fee</span><span>Status</span><span></span>
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map((member) => (
              <div key={member.id} className="grid grid-cols-[1fr_110px_110px_110px_90px_80px_60px] gap-4 px-6 py-3.5 items-center">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    {member.photo ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">{member.name[0]}</div>}
                  </div>
                  <p className="text-sm font-semibold text-navy truncate">{member.name}</p>
                </div>
                <span className="text-xs text-gray-500">{member.member_id || '—'}</span>
                <span className="text-xs text-gray-500">{member.membership_type || '—'}</span>
                <span className="text-xs text-gray-400 truncate">{member.representing || '—'}</span>
                <button onClick={() => toggleFee(member.id, member.fee_status)}>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${member.fee_status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                    {member.fee_status === 'paid' ? 'Paid' : 'Unpaid'}
                  </span>
                </button>
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
            {filtered.length === 0 && <div className="px-6 py-12 text-center text-gray-400 text-sm">No members found.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MembersClient({
  members: initialMembers,
  applications: initialApplications,
}: {
  members: Member[]
  applications: Application[]
}) {
  const [tab, setTab] = useState<'applications' | 'members'>('applications')
  const [members, setMembers] = useState(initialMembers)
  const pendingCount = initialApplications.filter((a) => a.status === 'pending').length

  function handleApproved(newMember: Member) {
    setMembers((prev) => {
      if (prev.find((m) => m.id === newMember.id)) return prev
      return [...prev, newMember].sort((a, b) => a.name.localeCompare(b.name))
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-bold text-navy">Membership</h1>
      </div>
      <div className="flex gap-1 mb-6 border-b border-gray-100">
        <button onClick={() => setTab('applications')}
          className="px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px"
          style={{ borderColor: tab === 'applications' ? '#E8192C' : 'transparent', color: tab === 'applications' ? '#E8192C' : '#6B7280' }}>
          Applications
          {pendingCount > 0 && (
            <span className="ml-2 text-[10px] font-black px-1.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: '#E8192C' }}>{pendingCount}</span>
          )}
        </button>
        <button onClick={() => setTab('members')}
          className="px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px"
          style={{ borderColor: tab === 'members' ? '#E8192C' : 'transparent', color: tab === 'members' ? '#E8192C' : '#6B7280' }}>
          Members
          <span className="ml-2 text-[10px] font-semibold text-gray-400">({members.length})</span>
        </button>
      </div>
      {tab === 'applications'
        ? <ApplicationsTab applications={initialApplications} onApproved={handleApproved} />
        : <MembersTab members={members} />
      }
    </div>
  )
}
