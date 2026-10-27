'use client'

import { useState, useEffect, useDeferredValue } from 'react'
import Link from 'next/link'
import {
  Filter,
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  TrendingUp,
  Sparkles,
  Zap,
  Star,
  Workflow,
  Music2,
  Code2,
  Video,
  Palette,
  Briefcase,
  Users,
  Image as ImageIcon,
  Bot,
  ShoppingCart,
  DollarSign,
  HeartPulse,
  GraduationCap,
  Mail,
  Database,
  Headphones,
  UserPlus,
  Megaphone,
  Edit3,
  Home,
  Share2,
  Scale,
  Languages,
  Loader2,
} from 'lucide-react'
import { CATEGORIES } from '@/data/category-list'
import featuredData from '@/data/featured-tools.json'
import { ToolGrid, EmptyState, ToolLogo } from '@/components/ToolCard'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'
import { TrendingTags } from '@/components/TrendingTags'
import type { Tool } from '@/types'

const PAGE_SIZE = 24

const PRICING_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Paid' },
] as const

type PricingFilter = (typeof PRICING_OPTIONS)[number]['value']

const CATEGORY_ICONS: Record<string, typeof Sparkles> = {
  Workflow,
  Music2,
  Code2,
  Video,
  Palette,
  Briefcase,
  Users,
  Image: ImageIcon,
  Bot,
  ShoppingCart,
  DollarSign,
  HeartPulse,
  GraduationCap,
  Mail,
  Database,
  Headphones,
  UserPlus,
  Megaphone,
  Edit3,
  TrendingUp,
  Home,
  Share2,
  Scale,
  Languages,
  Sparkles,
}

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = CATEGORY_ICONS[name] ?? Sparkles
  return <Icon className={className} />
}

export default function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [searchQuery, setSearchQuery] = useState(
    typeof searchParams.search === 'string' ? searchParams.search : ''
  )
  const [activeCategory, setActiveCategory] = useState(
    typeof searchParams.category === 'string' ? searchParams.category : 'all'
  )
  const [activeTag, setActiveTag] = useState('')
  const [activePricing, setActivePricing] = useState<PricingFilter>('all')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [tools, setTools] = useState<Tool[]>([])
  const [total, setTotal] = useState(0)
  const [catalogTotal, setCatalogTotal] = useState(() =>
    CATEGORIES.reduce((sum, category) => sum + category.count, 0)
  )
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)
  const deferredSearch = useDeferredValue(searchQuery)

  useEffect(() => {
    if (typeof searchParams.search === 'string') {
      setSearchQuery(searchParams.search)
      setPage(1)
    }
    if (typeof searchParams.category === 'string') {
      setActiveCategory(searchParams.category)
      setPage(1)
    }
  }, [searchParams.search, searchParams.category])

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      if (page === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      setError('')
      try {
        const params = new URLSearchParams({
          search: deferredSearch,
          category: activeCategory,
          pricing: activePricing,
          tag: activeTag,
          sort: sortBy,
          page: String(page),
          limit: String(PAGE_SIZE),
        })
        const response = await fetch(`/api/tools?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Unable to load tools')
        const data = (await response.json()) as {
          tools: Tool[]
          total: number
          catalogTotal: number
        }
        setTools((current) => (page === 1 ? data.tools : [...current, ...data.tools]))
        setTotal(data.total)
        setCatalogTotal(data.catalogTotal)
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Unable to load tools')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
          setLoadingMore(false)
        }
      }
    }
    load()
    return () => controller.abort()
  }, [deferredSearch, activeCategory, activePricing, activeTag, sortBy, page, reloadToken])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(1)
  }

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug)
    setPage(1)
  }

  const handlePricingChange = (value: PricingFilter) => {
    setActivePricing(value)
    setActiveTag('')
    setPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setPage(1)
  }

  const handleTagClick = (tag: string) => {
    setPage(1)
    if (tag === 'Free') {
      setActivePricing((current) => (current === 'free' ? 'all' : 'free'))
      setActiveTag('')
      return
    }
    if (tag === 'Popular' || tag === 'Trending' || tag === 'Most Saved') {
      setSortBy('visits')
      setActiveTag('')
      return
    }
    if (tag === 'New') {
      setSortBy('rating')
      setActiveTag('')
      return
    }
    setActiveTag((current) => (current === tag ? '' : tag))
  }

  const featuredTools = (featuredData as unknown as Tool[]).filter((tool) => tool.featured)
  const hasMore = tools.length < total

  const pricingColors = {
    free: 'bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
    freemium: 'bg-indigo-500/10 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30',
    paid: 'bg-rose-500/10 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30',
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full dark:bg-indigo-900/20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full dark:bg-emerald-900/20"></div>
      </div>

      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <LinkLogo />
            <span className="font-bold text-xl tracking-tight text-foreground">
              AI<span className="text-primary">ToolHunt</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <a href="#categories" className="hover:text-primary transition-colors">
              Categories
            </a>
            <a href="#featured" className="hover:text-primary transition-colors">
              Featured
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/submit" className="btn-primary hidden sm:block">
              <span>Submit AI Tool</span>
              <Zap className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 animate-pulse-glow">
            <Sparkles className="w-4 h-4" />
            <span>{catalogTotal.toLocaleString()}+ AI Tools &amp; {CATEGORIES.length} Categories</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Discover the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500">
              Best AI Tools
            </span>{' for Your Workflow'}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            A curated directory of the best AI tools and software for writing, image generation,
            video creation, coding, audio, design, marketing, and productivity. Find, compare,
            and choose the right AI tool for your workflow.
          </p>
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search size={20} strokeWidth={2} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search AI tools... (e.g. video generator, code assistant)"
              className={cn(
                'w-full pl-12 pr-10 py-5 rounded-3xl text-lg',
                'glass-input',
                'focus:ring-2 focus:ring-ring/50 shadow-lg',
              )}
            />
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent/50"
              aria-label="Clear search"
            >
              <Search className="w-5 h-5 opacity-60" />
            </button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <TrendingTags activeTag={activeTag} onTagClick={handleTagClick} />
          </div>
        </div>

        <section id="featured" className="mt-20">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Featured Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTools.slice(0, 4).map((tool) => (
              <FeaturedToolCard key={tool.id} tool={tool} pricingColors={pricingColors} />
            ))}
          </div>
        </section>
      </section>

      <section id="categories" className="py-20 max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground">Browse by Category</h2>
          <p className="text-muted-foreground mt-2">
            Explore AI tools organized by use case
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={cn(
              'group relative p-6 rounded-2xl text-left',
              activeCategory === 'all'
                ? 'bg-primary/10 border border-primary/30'
                : 'bg-card/50 border border-border/50 hover:bg-accent/50 hover:border-accent/50 transition-all duration-300',
            )}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-slate-500 group-hover:scale-110 transition-transform duration-300">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              All Tools
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {catalogTotal.toLocaleString()} tools
            </p>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className={cn(
                'group relative p-6 rounded-2xl text-left',
                activeCategory === cat.slug
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-card/50 border border-border/50 hover:bg-accent/50 hover:border-accent/50 transition-all duration-300',
              )}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ${cat.color}`}>
                <CategoryIcon name={cat.icon} className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {cat.count.toLocaleString()} tools
              </p>
            </button>
          ))}
        </div>
      </section>

      <main className="py-16 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="hidden lg:flex items-center justify-between mb-10 px-6 py-4 rounded-2xl glass-panel border border-border/50">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-end">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-input/50 bg-card/50 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Category:</span>
              <select
                value={activeCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="bg-transparent border-none text-sm font-medium text-foreground focus:ring-0 cursor-pointer appearance-none"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl border border-input/50 bg-card/50">
              {PRICING_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handlePricingChange(option.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    activePricing === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-input/50 bg-card/50 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-transparent border-none text-sm font-medium text-foreground focus:ring-0 cursor-pointer appearance-none"
              >
                <option value="featured">Featured</option>
                <option value="rating">Top Rated</option>
                <option value="name">A-Z</option>
                <option value="visits">Most Visited</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-xl transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-xl transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:hidden border-b border-border bg-background mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-medium text-foreground"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </div>
            {showFilters ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="lg:hidden px-6 py-4 rounded-2xl glass-panel border border-border/50 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Categories</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleCategoryChange('all')}
                className={cn(
                  'px-3 py-2 rounded-xl text-sm transition-colors text-center',
                  activeCategory === 'all'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-sm transition-colors text-center',
                    activeCategory === cat.slug
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between mb-4 mt-6">
              <h3 className="font-semibold text-foreground">Pricing</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PRICING_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handlePricingChange(option.value)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-sm transition-colors text-center',
                    activePricing === option.value
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {total}
              {total === 1 ? ' tool' : ' tools'} found
            </h2>
            {total > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Showing {tools.length} of {total}
              </p>
            )}
            {searchQuery.trim() && (
              <p className="text-sm text-muted-foreground mt-1">
                Search results for &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{catalogTotal.toLocaleString()} total</span>
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading tools...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <button
              type="button"
              onClick={() => setReloadToken((token) => token + 1)}
              className="btn-primary px-6 py-2"
            >
              Try again
            </button>
          </div>
        ) : tools.length === 0 ? (
          <EmptyState />
        ) : viewMode === 'grid' ? (
          <ToolGrid tools={tools} />
        ) : (
          <div className="space-y-4">
            {tools.map((tool) => (
              <ListToolCard key={tool.id} tool={tool} pricingColors={pricingColors} />
            ))}
          </div>
        )}

        {!loading && !error && hasMore && (
          <div className="flex flex-col items-center gap-2 mt-10">
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={loadingMore}
              className="btn-primary px-8 py-3 disabled:opacity-60"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More Tools
                  <ChevronDown className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
            <p className="text-xs text-muted-foreground">
              Showing {tools.length} of {total} &mdash; {total - tools.length} more available
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-background mt-auto py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <LinkLogo />
            <span className="font-bold text-lg tracking-tight text-foreground">
              AI<span className="text-primary">ToolHunt</span>
            </span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="/submit" className="hover:text-primary transition-colors">Submit Tool</Link>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">
          Built with Next.js, Tailwind CSS &mdash; © {new Date().getFullYear()} AI Tool Directory
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Tool data sourced from the{' '}
          <a
            href="https://autoventure.live"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            Autoventure AI Tools Dataset
          </a>
          .
        </p>
      </footer>
    </div>
  )
}

function LinkLogo() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary p-1 text-primary-foreground shadow-lg shadow-primary/25">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  )
}

function FeaturedToolCard({ tool, pricingColors }: { tool: any; pricingColors: any }) {
  return (
    <article className={cn(
      'glass-card rounded-2xl p-5 border border-border/50 hover:border-primary/30 transition-all duration-300 group',
    )}>
      <div className="flex items-start gap-3 mb-4">
        <ToolLogo tool={tool} className="h-9 w-9" />
        <div className="flex-1">
          <span className={cn('pricing-badge', pricingColors[tool.pricing])}>
            {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
          </span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
        {tool.name}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {tool.tagline}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{tool.category}</span>
        <div className="flex items-center gap-1 text-xs text-yellow-500">
          <Star className="w-3 h-3 fill-yellow-500" />
          <span>{tool.rating.toFixed(1)}</span>
        </div>
      </div>
    </article>
  )
}

function ListToolCard({ tool, pricingColors }: { tool: any; pricingColors: any }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors">
      <ToolLogo tool={tool} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="text-lg font-semibold text-foreground truncation">{tool.name}</h3>
          <span className={cn('pricing-badge', pricingColors[tool.pricing])}>
            {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {tool.description}
        </p>
        <div className="flex items-center gap-3 text-sm">
          <span className={cn(
            'category-badge',
            'bg-indigo-500/10 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30',
          )}>
            {tool.category}
          </span>
          <div className="flex items-center gap-1 text-yellow-500 text-xs">
            <Star className="w-3 h-3" />
            <span className="text-muted-foreground ml-0.5">{tool.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/90 whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-primary/5"
      >
        Visit <span className="text-xs">→</span>
      </a>
    </div>
  )
}
