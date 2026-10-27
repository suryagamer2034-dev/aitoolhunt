import { cn } from '@/lib/utils'

export const TRENDING_TAGS = [
  'Trending',
  'Popular',
  'New',
  'Free',
  'Most Saved',
  'AI Video Generator',
  'AI Image Generator',
  'AI Code Assistant',
  'AI Writing',
  'AI Voice',
] as const

interface TrendingTagsProps {
  activeTag: string
  onTagClick: (tag: string) => void
}

export function TrendingTags({ activeTag, onTagClick }: TrendingTagsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {TRENDING_TAGS.map((tag) => {
        const isActive = activeTag === tag
        return (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'bg-background text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
