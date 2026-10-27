'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Send,
  Sparkles,
} from 'lucide-react'
import { CATEGORIES } from '@/data/category-list'
import type { Tool } from '@/types'

const CATEGORY_OPTIONS = [...CATEGORIES].sort((a, b) => {
  if (a.name === 'Other') return 1
  if (b.name === 'Other') return -1
  return a.name.localeCompare(b.name)
})

const inputClass =
  'w-full rounded-xl border border-input bg-background/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50'

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function SubmitToolPage() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [pricing, setPricing] = useState('freemium')
  const [tags, setTags] = useState('')
  const [logo, setLogo] = useState('')
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [error, setError] = useState('')
  const [submittedTool, setSubmittedTool] = useState<Tool | null>(null)

  const resetForm = () => {
    setName('')
    setUrl('')
    setTagline('')
    setDescription('')
    setCategory('')
    setPricing('freemium')
    setTags('')
    setLogo('')
    setStatus('idle')
    setError('')
    setSubmittedTool(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setError('')

    try {
      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          url,
          tagline,
          description,
          category,
          pricing,
          tags: tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          logo,
        }),
      })

      const data = (await response.json()) as { tool?: Tool; error?: string }

      if (!response.ok || !data.tool) {
        throw new Error(data.error || 'Unable to submit tool.')
      }

      setSubmittedTool(data.tool)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit tool.')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full dark:bg-indigo-900/20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full dark:bg-emerald-900/20"></div>
      </div>

      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary p-1 text-primary-foreground shadow-lg shadow-primary/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              AI<span className="text-primary">ToolHunt</span>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to directory
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Share your tool with the community</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Submit an AI Tool
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Add your AI tool to the directory. It will be saved to the catalog immediately and
            become searchable.
          </p>
        </div>

        {status === 'success' && submittedTool ? (
          <div className="glass-card rounded-3xl p-8 md:p-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Tool submitted</h2>
            <p className="text-muted-foreground mb-6">
              <span className="font-semibold text-foreground">{submittedTool.name}</span> has been
              added to the directory.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/?search=${encodeURIComponent(submittedTool.name)}`}
                className="btn-primary px-6 py-3"
              >
                View listing
              </Link>
              <button type="button" onClick={resetForm} className="btn-ghost px-6 py-3">
                Submit another tool
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-3xl p-6 md:p-8 space-y-6"
          >
            {status === 'error' && error && (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                  Tool name <span className="text-destructive">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Acme AI"
                  className={inputClass}
                  minLength={2}
                  maxLength={100}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="url" className="mb-2 block text-sm font-medium text-foreground">
                  Website URL <span className="text-destructive">*</span>
                </label>
                <input
                  id="url"
                  type="text"
                  inputMode="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://example.com"
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="tagline" className="mb-2 block text-sm font-medium text-foreground">
                  Tagline
                </label>
                <input
                  id="tagline"
                  type="text"
                  value={tagline}
                  onChange={(event) => setTagline(event.target.value)}
                  placeholder="A short one-line description"
                  className={inputClass}
                  maxLength={160}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Optional. Max 160 characters.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What does this tool do? Who is it for?"
                  className={`${inputClass} min-h-[140px] resize-y`}
                  minLength={10}
                  maxLength={1000}
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">10–1000 characters.</p>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="pricing"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Pricing <span className="text-destructive">*</span>
                </label>
                <select
                  id="pricing"
                  value={pricing}
                  onChange={(event) => setPricing(event.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="mb-2 block text-sm font-medium text-foreground">
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="AI, Writing, Productivity"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Comma-separated, up to 10 tags.
                </p>
              </div>

              <div>
                <label htmlFor="logo" className="mb-2 block text-sm font-medium text-foreground">
                  Logo URL
                </label>
                <input
                  id="logo"
                  type="text"
                  inputMode="url"
                  value={logo}
                  onChange={(event) => setLogo(event.target.value)}
                  placeholder="https://example.com/logo.png"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Optional. We&apos;ll use the site favicon if left blank.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <Link href="/" className="btn-ghost px-4 py-2 text-sm text-center">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary px-8 py-3 disabled:opacity-60"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit tool
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          By submitting, you confirm the tool is AI-related and the details are accurate.
        </p>
      </main>
    </div>
  )
}
