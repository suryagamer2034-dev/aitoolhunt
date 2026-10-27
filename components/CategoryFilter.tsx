'use client'

import { useState, useCallback } from 'react'
import { Filter, X, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: { id: string; name: string; slug: string; count: number }[]
  activeCategory: string
  onCategoryChange: (slug: string) => void
  className?: string
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  className,
}: CategoryFilterProps) {
  const [showMore, setShowMore] = useState(false)
  const visibleCategories = showMore ? categories : categories.slice(0, 6)

  const handleCategoryClick = useCallback(
    (slug: string) => {
      onCategoryChange(slug)
    },
    [onCategoryChange]
  )

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 rounded-xl border border-border/50">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter size={16} />
          <span>Categories</span>
        </div>
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-xs text-primary hover:text-primary/90 transition-colors"
        >
          {showMore ? 'Show less' : 'Show more'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 px-4 pb-4">
        {visibleCategories.map((category) => {
          const isActive = activeCategory === category.slug
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : 'bg-background text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <span>{category.name}</span>
              <span className="h-2 w-2 rounded-full bg-current opacity-60"></span>
            </button>
          )
        })}
      </div>

      {categories.length > 6 && (
        <div className="px-4 pt-2 text-center">
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-xs font-medium text-primary hover:text-primary/90 transition-colors"
          >
            {showMore ? <X size={14} className="mr-1" /> : <CheckCircle2 size={14} className="mr-1" />}
            {showMore ? 'Hide' : 'View all ' + categories.length}
          </button>
        </div>
      )}
    </div>
  )
}
