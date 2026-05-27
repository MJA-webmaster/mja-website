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
}

export default function SettingsClient({ settings: initial }: { settings: Settings }) {
  const [settings, setSettings] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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

  const sections = [
    {
      title: 'General',
      fields: [
        { name: 'site_name', label: 'Site Name', placeholder: 'Maldives Journalists Association' },
        { name: 'email', label: 'Contact Email', placeholder: 'info@mja.mv', type: 'email' },
        { name: 'phone', label: 'Phone Number', placeholder: '+960 300 0000' },
        { name: 'address', label: 'Address', placeholder: 'Malé, Republic of Maldives' },
      ],
    },
    {
      title: 'Social Media',
      fields: [
        { name: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/MaldivesJournalists' },
        { name: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/mja.mv' },
        { name: 'twitter', label: 'Twitter / X URL', placeholder: 'https://twitter.com/MJAMaldives' },
        { name: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/mja' },
      ],
    },
  ]

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
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-navy text-sm mb-5 pb-3 border-b border-gray-100">{section.title}</h2>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={(settings as any)[field.name] ?? ''}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-navy focus:outline-none"
                    onFocus={(e) => e.target.style.borderColor = '#E8192C'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
