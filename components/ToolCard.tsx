import { useState } from 'react'
import Link from 'next/link'
import { Star, ExternalLink, TrendingUp, Search } from 'lucide-react'
import { Tool } from '@/types'
import { cn } from '@/lib/utils'

function formatVisits(num?: number): string {
  if (!num) return 'N/A'
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
  return num.toString()
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export function ToolLogo({ tool, className }: { tool: Tool; className?: string }) {
  const [showFallback, setShowFallback] = useState(false)
  const domain = getDomain(tool.url)
  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : ''

  return (
    <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground shrink-0 relative', className)}>
      <img
        src={faviconUrl || tool.logo}
        alt={tool.name}
        className="h-10 w-10 rounded-lg object-cover"
        onError={() => setShowFallback(true)}
      />
      {showFallback && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary bg-primary/10 rounded-full w-6 h-6 shadow-sm border border-primary/20">
          {tool.name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const pricingColors: Record<string, string> = {
    free: 'bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
    freemium: 'bg-indigo-500/10 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30',
    paid: 'bg-rose-500/10 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30',
  }

  return (
    <Link href={tool.url} target="_blank" rel="noopener noreferrer" className="group block">
      <article className={cn(
        'glass-card rounded-2xl p-6 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300',
        'border border-border/50',
      )}>
        <div className="absolute top-4 right-4">
          <span className={cn('pricing-badge', pricingColors[tool.pricing])}>
            {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
          </span>
        </div>

        <div className="flex items-start gap-4 mb-4">
          <ToolLogo tool={tool} />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                {tool.name}
              </h3>
              <span className={cn(
                'category-badge',
                'bg-indigo-500/10 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30',
              )}>
                {tool.category}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {tool.tagline}
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
          {tool.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border/50 dark:bg-secondary/50 dark:text-secondary-foreground dark:border-secondary"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs">
            <Star className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-muted-foreground font-medium">{tool.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({tool.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-primary">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-medium">{formatVisits(tool.monthlyVisits)}</span>
          </div>
          <button
            className={cn(
              'btn-ghost px-3 py-1.5 text-xs font-medium text-primary',
              'hover:bg-primary/10 hover:text-primary/90',
            )}
            aria-label={`Visit ${tool.name}`}
          >
            Visit <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </article>
    </Link>
  )
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">No tools found</h3>
      <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
    </div>
  )
}

export function ToolGrid({ tools }: { tools: Tool[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  )
}
