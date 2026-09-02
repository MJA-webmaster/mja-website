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

export const EMPLOYMENT_TYPES = [
  'Media Organisation',
  'Freelance',
] as const

// TODO: confirm against MJA's Google Form
export const NATURE_OF_WORK = [
  'Reporter',
  'Editor',
  'Photojournalist',
  'Videographer / Camera Operator',
  'Producer',
  'Presenter',
  'Other',
] as const

export const FEE_STATUSES = ['paid', 'unpaid'] as const
export type FeeStatus = (typeof FEE_STATUSES)[number]
