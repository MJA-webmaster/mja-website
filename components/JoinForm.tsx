'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MEMBERSHIP_TYPES, EMPLOYMENT_TYPES, NATURE_OF_WORK } from '@/lib/membership'

const inputClass =
  'w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none text-navy'
const labelClass =
  'block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5'

type Uploads = {
  photo: File | null
  idCard: File | null
  portfolio: File | null
}

export default function JoinForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    membership_type: 'Professional',
    full_name: '',
    common_name: '',
    id_card_no: '',
    email: '',
    mobile_no: '',
    employment_type: 'Media Organisation',
    nature_of_work: 'Reporter',
    workplace_name: '',
    designation: '',
    atoll_island: '',
    message: '',
    declaration: false,
  })

  const [files, setFiles] = useState<Uploads>({ photo: null, idCard: null, portfolio: null })

  const isCorporate = form.membership_type === 'Corporate'
  const needsWorkplace = !isCorporate && form.employment_type === 'Media Organisation'

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const target = e.target
    const val = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
    setForm({ ...form, [target.name]: val })
  }

  function handleFile(key: keyof Uploads) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFiles({ ...files, [key]: e.target.files?.[0] ?? null })
    }
  }

  async function uploadOne(file: File | null, folder: string): Promise<string | null> {
    if (!file) return null
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from('membership-docs').upload(path, file)
    if (error) throw new Error(`Could not upload ${folder}: ${error.message}`)
    return path
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.declaration) {
      setError('Please agree to the declaration before submitting.')
      return
    }

    setLoading(true)

    try {
      const [photo_url, id_card_url, portfolio_url] = await Promise.all([
        uploadOne(files.photo, 'photo'),
        uploadOne(files.idCard, 'id-card'),
        uploadOne(files.portfolio, 'portfolio'),
      ])

      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, photo_url, id_card_url, portfolio_url }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'rgba(232,25,44,0.1)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#E8192C" strokeWidth="2.5" className="w-8 h-8">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-headline text-2xl font-bold text-navy mb-2">Application Received</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Thank you for applying. Our team will review your application and get back to you within 3 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Membership type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
          Membership Type
        </label>
        <div className="space-y-2">
          {MEMBERSHIP_TYPES.map((t) => (
            <label
              key={t.value}
              className="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
              style={{
                borderColor: form.membership_type === t.value ? '#E8192C' : '#E5E7EB',
                backgroundColor: form.membership_type === t.value ? 'rgba(232,25,44,0.03)' : 'white',
              }}
            >
              <input
                type="radio"
                name="membership_type"
                value={t.value}
                checked={form.membership_type === t.value}
                onChange={handleChange}
                className="mt-0.5"
                style={{ accentColor: '#E8192C' }}
              />
              <div>
                <p className="text-sm font-semibold text-navy">{t.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.blurb}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            {isCorporate ? 'Organisation Name *' : 'Full Name *'}
          </label>
          <input
            type="text" name="full_name" value={form.full_name} onChange={handleChange} required
            placeholder={isCorporate ? 'e.g. Mihaaru News' : 'Ahmed Mohamed Didi'}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            {isCorporate ? 'Contact Person *' : 'Common Name'}
          </label>
          <input
            type="text" name="common_name" value={form.common_name} onChange={handleChange}
            required={isCorporate}
            placeholder={isCorporate ? 'Name of contact person' : 'Ahmed'}
            className={inputClass}
          />
        </div>
      </div>

      {/* ID / registration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            {isCorporate ? 'Registration No. *' : 'ID Card No. *'}
          </label>
          <input
            type="text" name="id_card_no" value={form.id_card_no} onChange={handleChange} required
            placeholder={isCorporate ? 'e.g. C-1234/2020' : 'e.g. A123456'}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Atoll / Island</label>
          <input
            type="text" name="atoll_island" value={form.atoll_island} onChange={handleChange}
            placeholder="e.g. K. Malé"
            className={inputClass}
          />
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Email Address *</label>
          <input
            type="email" name="email" value={form.email} onChange={handleChange} required
            placeholder="ahmed@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Mobile Number *</label>
          <input
            type="tel" name="mobile_no" value={form.mobile_no} onChange={handleChange} required
            placeholder="+960 7XX XXXX"
            className={inputClass}
          />
        </div>
      </div>

      {/* Individual-only: employment + nature of work */}
      {!isCorporate && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Employment Type *</label>
              <select
                name="employment_type" value={form.employment_type} onChange={handleChange}
                className={inputClass}
              >
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Nature of Work *</label>
              <select
                name="nature_of_work" value={form.nature_of_work} onChange={handleChange}
                className={inputClass}
              >
                {NATURE_OF_WORK.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Workplace {needsWorkplace ? '*' : ''}
              </label>
              <input
                type="text" name="workplace_name" value={form.workplace_name} onChange={handleChange}
                required={needsWorkplace}
                placeholder="e.g. Mihaaru, PSM, Avas"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Designation {needsWorkplace ? '*' : ''}
              </label>
              <input
                type="text" name="designation" value={form.designation} onChange={handleChange}
                required={needsWorkplace}
                placeholder="e.g. Senior Reporter"
                className={inputClass}
              />
            </div>
          </div>
        </>
      )}

      {/* Corporate-only: contact designation */}
      {isCorporate && (
        <div>
          <label className={labelClass}>Contact Person&apos;s Designation *</label>
          <input
            type="text" name="designation" value={form.designation} onChange={handleChange} required
            placeholder="e.g. Editor-in-Chief"
            className={inputClass}
          />
        </div>
      )}

      {/* Uploads */}
      <div className="space-y-4 pt-2">
        <div>
          <label className={labelClass}>
            {isCorporate ? 'Organisation Logo' : 'Passport Photo *'}
          </label>
          <input
            type="file" accept="image/*" onChange={handleFile('photo')}
            required={!isCorporate}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-navy"
          />
        </div>
        <div>
          <label className={labelClass}>
            {isCorporate ? 'Registration Certificate *' : 'ID Card Copy *'}
          </label>
          <input
            type="file" accept="image/*,application/pdf" onChange={handleFile('idCard')} required
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-navy"
          />
        </div>
        {!isCorporate && (
          <div>
            <label className={labelClass}>Portfolio / Work Samples</label>
            <input
              type="file" accept="image/*,application/pdf" onChange={handleFile('portfolio')}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-navy"
            />
            <p className="text-xs text-gray-400 mt-1">Optional. PDF or image, max 10MB.</p>
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Anything else you would like to add?</label>
        <textarea
          name="message" value={form.message} onChange={handleChange} rows={4}
          placeholder="Optional"
          className={inputClass + ' resize-none'}
        />
      </div>

      {/* Declaration */}
      <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer">
        <input
          type="checkbox" name="declaration" checked={form.declaration} onChange={handleChange}
          className="mt-0.5" style={{ accentColor: '#E8192C' }}
        />
        <span className="text-xs text-gray-500 leading-relaxed">
          I declare that the information given above is true and correct to the best of my knowledge,
          and I agree to abide by the constitution and code of conduct of the Maldives Journalists Association.
        </span>
      </label>

      {error && (
        <p
          className="text-sm px-4 py-3 rounded-lg"
          style={{
            color: '#E8192C',
            backgroundColor: 'rgba(232,25,44,0.08)',
            border: '1px solid rgba(232,25,44,0.2)',
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit" disabled={loading || !form.declaration}
        className="w-full text-white py-4 rounded-lg font-bold text-sm tracking-wide transition-opacity disabled:opacity-60"
        style={{ backgroundColor: '#E8192C' }}
      >
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  )
}
