export const RESOURCE_CATEGORIES = [
  {
    slug: 'publications',
    label: 'Publications',
    blurb: 'Reports, guidelines and books',
    subcategories: ['Reports', 'Guidelines', 'Books'],
  },
  {
    slug: 'annual-reports',
    label: 'Annual Reports & Financials',
    blurb: 'Yearly reports and audited accounts',
    subcategories: ['Annual Report', 'Financial Statement'],
  },
  {
    slug: 'multimedia',
    label: 'Multimedia',
    blurb: 'Photo and video',
    subcategories: ['Photo', 'Video'],
  },
] as const

export type ResourceCategorySlug = (typeof RESOURCE_CATEGORIES)[number]['slug']

export function subcategoriesFor(slug: string): readonly string[] {
  return RESOURCE_CATEGORIES.find((c) => c.slug === slug)?.subcategories ?? []
}

export function labelFor(slug: string): string {
  return RESOURCE_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug
}
