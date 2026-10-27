export interface Tool {
  id: string
  name: string
  slug: string
  description: string
  tagline: string
  category: string
  tags: string[]
  rating: number
  reviews: number
  pricing: 'free' | 'freemium' | 'paid'
  url: string
  logo: string
  featured: boolean
  monthlyVisits?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  count: number
  color: string
  icon: string
}

export interface FilterState {
  search: string
  category: string
  pricing: 'all' | 'free' | 'freemium' | 'paid'
  sort: 'featured' | 'name' | 'rating' | 'visits'
}
