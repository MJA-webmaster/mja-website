'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Member } from '@/lib/types'
import { MEMBERSHIP_TYPES } from '@/lib/membership'
import ImageUpload from '@/components/ImageUpload'
import { Plus, Trash2, ChevronDown, ChevronUp, Check, X } from 'lucide-react'

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
  name: '', category: 'category-one' as Member['category'],
  membership_type: 'Professional' as Member['membership_type'],
  member_id: '', id_card_no: '', representing: '', years_in_journalism: '',
  photo: '', bio: '', facebook: '', instagram: '', linkedin: '', twitter: '',
  member_since: '', fee_status: 'unpaid' as Member['fee_status'],
  fee_paid_until: '', is_active: true,
}

const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none'
const labelClass = 'block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5'

function displayName(a: Application) { return a.full_name || a.name || 'Unnamed applicant' }
function displayType(a: Application) { return a.membership_type || a.type || '—' }
