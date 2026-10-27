'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import { CATEGORIES } from '@/data/category-list'
import { cn } from '@/lib/utils'

interface CategoryItem {
  id: string
  name: string
  slug: string
  count: number
  color: string
}

interface CategorySidebarProps {
  categories: CategoryItem[]
  activeCategory: string
  onCategoryChange: (slug: string) => void
}

export function CategorySidebar({
  categories,
  activeCategory,
  onCategoryChange,
}: CategorySidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-4">
      <div className="glass-panel rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Categories
        </h2>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange('all')}
            className={cn(
              'flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors',
              activeCategory === 'all'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            <span>All Categories</span>
            <span className="text-xs font-medium">
              {CATEGORIES.reduce((sum, c) => sum + c.count, 0)}
            </span>
          </button>
          {categories.map((category) => {
            const isActive = activeCategory === category.slug
            const colorClass = isActive ? 'text-primary' : 'text-muted-foreground'
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.slug)}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'hover:bg-accent hover:text-accent-foreground',
                  colorClass,
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      isActive ? 'bg-primary' : 'bg-muted-foreground',
                    )}
                  />
                  {category.name}
                </span>
                <span className="text-xs font-medium">{category.count}</span>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
