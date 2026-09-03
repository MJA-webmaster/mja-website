export type Article = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string | null
  category: 'latest' | 'top-news' | 'news-room'
  cover_image: string | null
  cover_image: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  show_prompt: boolean
}

export type Campaign = {
  id: string
  title: string
  slug: string
  hashtag: string | null
  description: string
  content: string
  cover_image: string | null
  event_date: string | null
  event_location: string | null
  cover_image: string | null
  cover_image: string | null
  published: boolean
  created_at: string
  updated_at: string
  show_prompt: boolean
}

export type Member = {
  id: string
  name: string
  category: 'category-one' | 'category-two' | 'category-three'
  representing: string | null
  years_in_journalism: number | null
  photo: string | null
  bio: string | null
  facebook: string | null
  instagram: string | null
  linkedin: string | null
  twitter: string | null
  member_since: string | null
  is_active: boolean
  created_at: string
  id_card_no: string | null
  member_id: string | null
  membership_type: 'Professional' | 'Student' | 'Corporate'
  fee_status: 'paid' | 'unpaid'
  fee_paid_until: string | null
}

export type ExecutiveCommitteeMember = {
  id: string
  name: string
  role: string
  is_president: boolean
  representing: string | null
  years_in_journalism: number | null
  photo: string | null
  bio: string | null
  facebook: string | null
  instagram: string | null
  linkedin: string | null
  twitter: string | null
  order: number
  created_at: string
}

export type TeamMember = {
  id: string
  name: string
  position: string
  photo: string | null
  bio: string | null
  order: number
  created_at: string
}

export type Resource = {
  id: string
  title: string
  description: string | null
  category: 'publications' | 'annual-reports' | 'financials' | 'multimedia'
  subcategory: string | null
  file_url: string | null
  external_url: string | null
  file_size: string | null
  cover_image: string | null
  cover_image: string | null
  published: boolean
  created_at: string
}

export type NewsletterSubscriber = {
  id: string
  email: string
  subscribed_at: string
}

export type MemberStats = {
  local: number
  international: number
  non_member_contributors: number
  total: number
  media_outlets: number
  male: number
  female: number
}
