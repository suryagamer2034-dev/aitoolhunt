import Link from 'next/link'
import { Menu, Search, Github, Star, ArrowRight, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary p-1 text-primary-foreground shadow-lg shadow-primary/20">
              <ShieldCheck size={20} strokeWidth={2} />
            </div>
            <span className="font-bold text-xl tracking-tight">AI<span className="text-primary">ToolHunt</span></span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="#categories" className="hover:text-primary transition-colors">
            Categories
          </Link>
          <Link href="#featured" className="hover:text-primary transition-colors">
            Featured
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center p-2 text-sm font-medium rounded-md border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>
    </nav>
  )
}

export function Hero() {
  return (
    <section className="relative px-6 pt-20 pb-32 max-w-7xl mx-auto text-balance">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
          Discover the Best{' '}
          <span className="relative inline-block">
            AI Tools
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/20 rounded-full -z-1"></span>
          </span>
          {' for Your Next Project'}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          A curated directory of the best AI tools and software for writing, image generation,
          video creation, coding, audio, design, marketing, and productivity. Find, compare,
          and choose the right AI tool for your workflow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar />
        </div>
      </div>
    </section>
  )
}

function SearchBar() {
  return (
    <div className="relative w-full max-w-3xl">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search size={18} />
      </div>
      <input
        type="text"
        placeholder="Search AI tools... (e.g. video generator, code assistant)"
        className="w-full pl-10 pr-4 py-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all shadow-sm"
      />
      <button className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
        <ArrowRight size={16} />
      </button>
    </div>
  )
}

export function Stats() {
  const stats = [
    { label: 'AI Tools', value: '31,201+' },
    { label: 'Categories', value: '459' },
    { label: 'Monthly Users', value: '2.5M+' },
    { label: 'Verified Tools', value: '100%' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 border-y border-border py-8">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-3xl font-bold text-foreground">{stat.value}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
