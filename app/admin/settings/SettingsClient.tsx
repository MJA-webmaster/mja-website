'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Settings = {
  site_name?: string
  email?: string
  phone?: string
  address?: string
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  dispatch?: string
}

export default function SettingsClient({ settings: initial }: { settings: Settings }) {
  const [settings, setSettings] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setSettings({ ...settings, [e.target.name]: e.target.value })
  }

  async function handleSave() {
    setSaving(true)
    setMessage('')
    const supabase = createClient()
    const { error } = await supabase
      .from('settings')
      .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() })

    setSaving(false)
    setMessage(error ? 'Error saving' : 'Settings saved!')
    setTimeout(() => setMessage(''), 3000)
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-navy focus:outline-none transition-colors'
  const labelClass = 'block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5'

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => e.target.style.borderColor = '#E8192C'
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => e.target.style.borderColor = '#E5E7EB'

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Site-wide configuration for MJA website</p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span className={`text-sm font-semibold ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ backgroundColor: '#E8192C' }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Live Dispatch */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-navy text-sm mb-1 pb-3 border-b border-gray-100">
            Live Dispatch Ticker
          </h2>
          <p className="text-xs text-gray-400 mb-4 mt-3 leading-relaxed">
            Appears at the bottom of the homepage hero. Keep it short — one sentence, maximum 120 characters. Leave blank to show the default MJA monitoring line.
          </p>
          <label className={labelClass}>Dispatch Text</label>
          <textarea
            name="dispatch"
            value={settings.dispatch ?? ''}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="e.g. Independent journalists denied access to Majlis hearing. Read Statement →"
            rows={2}
            maxLength={160}
            className={inputClass + ' resize-none'}
          />
          <p className="text-[11px] text-gray-300 mt-1 text-right">
            {(settings.dispatch ?? '').length}/160
          </p>
        </div>

        {/* General */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-navy text-sm mb-5 pb-3 border-b border-gray-100">General</h2>
          <div className="space-y-4">
            {[
              { name: 'site_name', label: 'Site Name', placeholder: 'Maldives Journalists Association' },
              { name: 'email', label: 'Contact Email', placeholder: 'info@mja.mv', type: 'email' },
              { name: 'phone', label: 'Phone Number', placeholder: '+960 300 0000' },
              { name: 'address', label: 'Address', placeholder: 'Malé, Republic of Maldives' },
            ].map((field) => (
              <div key={field.name}>
                <label className={labelClass}>{field.label}</label>
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={(settings as any)[field.name] ?? ''}
                  onChange={handleChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-navy text-sm mb-5 pb-3 border-b border-gray-100">Social Media</h2>
          <div className="space-y-4">
            {[
              { name: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/mjamaldives' },
              { name: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/mjamaldives' },
              { name: 'twitter', label: 'Twitter / X URL', placeholder: 'https://x.com/mjamaldives' },
              { name: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/mja' },
            ].map((field) => (
              <div key={field.name}>
                <label className={labelClass}>{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={(settings as any)[field.name] ?? ''}
                  onChange={handleChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
