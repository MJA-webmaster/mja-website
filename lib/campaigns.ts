import type { Campaign } from '@/lib/types'

export type ComputedStatus = 'upcoming' | 'active' | 'past'

export function getCampaignStatus(campaign: Pick<Campaign, 'status' | 'event_date'>): ComputedStatus {
  if (campaign.status) return campaign.status
  if (campaign.event_date && new Date(campaign.event_date) > new Date()) return 'upcoming'
  return 'active'
}

export const STATUS_EYEBROW: Record<ComputedStatus, string> = {
  active: 'ACTIVE CAMPAIGN',
  upcoming: 'UPCOMING CAMPAIGN',
  past: 'CAMPAIGN ARCHIVE',
}

export const STATUS_BADGE_STYLE: Record<ComputedStatus, { bg: string; text: string; label: string }> = {
  active: { bg: '#FEE2E2', text: '#E8192C', label: 'Active' },
  upcoming: { bg: '#F3F4F6', text: '#6B7280', label: 'Upcoming' },
  past: { bg: '#E5E7EB', text: '#374151', label: 'Past' },
}

export const STATUS_DOT_COLOR: Record<ComputedStatus, string> = {
  active: '#E8192C',
  upcoming: '#9CA3AF',
  past: '#0D1B2A',
}
