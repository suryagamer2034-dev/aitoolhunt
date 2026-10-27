'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search size={20} strokeWidth={2} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search AI tools... (e.g. video generator, code assistant)'}
        className={cn(
          'w-full pl-11 pr-4 py-4 rounded-2xl',
          'glass-input',
          'text-base focus:ring-1 focus:ring-ring/50 transition-all duration-200',
        )}
      />
      {value.trim() && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <Search className="w-5 h-5 opacity-50" />
        </button>
      )}
    </div>
  )
}
