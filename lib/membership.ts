export const MEMBERSHIP_TYPES = [
  {
    value: 'Professional',
    label: 'Professional',
    blurb: 'Working journalists and media professionals',
  },
  {
    value: 'Student',
    label: 'Student',
    blurb: 'Journalism and media students',
  },
  {
    value: 'Corporate',
    label: 'Corporate',
    blurb: 'Media organisations and institutions',
  },
] as const

export type MembershipType = (typeof MEMBERSHIP_TYPES)[number]['value']

export const FEE_STATUSES = ['paid', 'unpaid'] as const
export type FeeStatus = (typeof FEE_STATUSES)[number]
