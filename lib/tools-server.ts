import fs from 'node:fs'
import path from 'node:path'
import { CATEGORIES } from '@/data/category-list'
import type { Tool } from '@/types'

const DATA_DIR = path.join(process.cwd(), 'data')
const TOOLS_PATH = path.join(DATA_DIR, 'ai-tools.json')
const CATEGORIES_PATH = path.join(DATA_DIR, 'categories.json')

let cachedTools: Tool[] | null = null

function getTools(): Tool[] {
  if (!cachedTools) {
    cachedTools = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf8')) as Tool[]
  }
  return cachedTools
}

export class ToolSubmissionError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'ToolSubmissionError'
    this.status = status
  }
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new ToolSubmissionError('Website URL is required.')
  }
  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`
  let parsed: URL
  try {
    parsed = new URL(withProtocol)
  } catch {
    throw new ToolSubmissionError('Please enter a valid website URL.')
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new ToolSubmissionError('Website URL must start with http:// or https://.')
  }
  return parsed.toString()
}

function urlKey(value: string): string {
  try {
    const parsed = new URL(value)
    return `${parsed.hostname.replace(/^www\./i, '').toLowerCase()}${parsed.pathname
      .replace(/\/+$/g, '')
      .toLowerCase()}`
  } catch {
    return value.trim().toLowerCase()
  }
}

function uniqueTags(values: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const value of values) {
    const tag = value.trim()
    if (!tag) continue
    const key = tag.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(tag)
  }
  return result
}

export function addTool(input: unknown): Tool {
  if (!input || typeof input !== 'object') {
    throw new ToolSubmissionError('Invalid submission data.')
  }

  const body = input as Record<string, unknown>
  const name = asString(body.name)
  if (name.length < 2 || name.length > 100) {
    throw new ToolSubmissionError('Tool name must be between 2 and 100 characters.')
  }

  const url = normalizeUrl(asString(body.url))
  const description = asString(body.description)
  if (description.length < 10 || description.length > 1000) {
    throw new ToolSubmissionError('Description must be between 10 and 1000 characters.')
  }

  const taglineInput = asString(body.tagline)
  const tagline = (taglineInput || description).slice(0, 160)

  const categoryInput = asString(body.category)
  const category = CATEGORIES.find(
    (item) =>
      item.name.toLowerCase() === categoryInput.toLowerCase() ||
      item.slug.toLowerCase() === categoryInput.toLowerCase() ||
      item.id.toLowerCase() === categoryInput.toLowerCase()
  )
  if (!category) {
    throw new ToolSubmissionError('Please select a valid category.')
  }

  const pricingInput = asString(body.pricing).toLowerCase()
  const pricing: Tool['pricing'] =
    pricingInput === 'free' || pricingInput === 'paid' || pricingInput === 'freemium'
      ? pricingInput
      : 'freemium'

  const rawTags = body.tags
  const tagValues = Array.isArray(rawTags)
    ? rawTags.map((tag) => (typeof tag === 'string' ? tag : ''))
    : typeof rawTags === 'string'
      ? rawTags.split(',')
      : []
  const tags = uniqueTags([...tagValues, category.name, 'AI']).slice(0, 10)

  const logoInput = asString(body.logo)
  const hostname = new URL(url).hostname
  let logo = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
  if (logoInput) {
    try {
      logo = normalizeUrl(logoInput)
    } catch {
      // Ignore an invalid logo URL and fall back to the site favicon.
    }
  }

  const tools = getTools()
  const compareUrl = urlKey(url)
  const duplicate = tools.find((tool) => urlKey(tool.url) === compareUrl)
  if (duplicate) {
    throw new ToolSubmissionError(
      `This tool is already listed as "${duplicate.name}".`,
      409
    )
  }

  const baseSlug = slugify(name) || `tool-${Date.now()}`
  let slug = baseSlug
  let suffix = 2
  while (tools.some((tool) => tool.slug === slug)) {
    slug = `${baseSlug}-${suffix}`
    suffix += 1
  }

  const tool: Tool = {
    id: `tool-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    slug,
    description,
    tagline,
    category: category.name,
    tags,
    rating: 0,
    reviews: 0,
    pricing,
    url,
    logo,
    featured: false,
    monthlyVisits: 0,
  }

  const updated = [...tools, tool]
  fs.writeFileSync(TOOLS_PATH, JSON.stringify(updated, null, 2), 'utf8')
  cachedTools = updated

  category.count += 1
  try {
    fs.writeFileSync(CATEGORIES_PATH, JSON.stringify(CATEGORIES, null, 2), 'utf8')
  } catch (error) {
    console.error('Failed to update category counts:', error)
  }

  return tool
}

export interface ToolQuery {
  search?: string
  category?: string
  pricing?: string
  tag?: string
  sort?: string
  page?: number
  limit?: number
}

export interface ToolPage {
  tools: Tool[]
  total: number
  catalogTotal: number
  page: number
  limit: number
  hasMore: boolean
}

export function queryTools(query: ToolQuery): ToolPage {
  const search = (query.search || '').trim().toLowerCase()
  const category = query.category || 'all'
  const pricing = query.pricing || 'all'
  const tag = (query.tag || '').trim().toLowerCase()
  const sort = query.sort || 'featured'
  const page = Math.max(1, Math.floor(query.page || 1))
  const limit = Math.min(100, Math.max(1, Math.floor(query.limit || 24)))

  const allTools = getTools()
  const catalogTotal = allTools.length
  let result = allTools

  if (category !== 'all') {
    const match = CATEGORIES.find((item) => item.slug === category || item.name === category)
    const name = match ? match.name : category
    result = result.filter((tool) => tool.category === name)
  }

  if (pricing !== 'all') {
    result = result.filter((tool) => tool.pricing === pricing)
  }

  if (tag) {
    result = result.filter((tool) => tool.tags.some((item) => item.toLowerCase() === tag))
  }

  if (search) {
    result = result.filter(
      (tool) =>
        tool.name.toLowerCase().includes(search) ||
        tool.tagline.toLowerCase().includes(search) ||
        tool.description.toLowerCase().includes(search) ||
        tool.category.toLowerCase().includes(search) ||
        tool.slug.toLowerCase().includes(search) ||
        tool.tags.some((item) => item.toLowerCase().includes(search))
    )
  }

  result = [...result].sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating
    if (sort === 'name') return a.name.localeCompare(b.name)
    if (sort === 'visits') return (b.monthlyVisits || 0) - (a.monthlyVisits || 0)
    return Number(b.featured) - Number(a.featured) || b.rating - a.rating
  })

  const total = result.length
  const start = (page - 1) * limit
  const tools = result.slice(start, start + limit)

  return {
    tools,
    total,
    catalogTotal,
    page,
    limit,
    hasMore: start + tools.length < total,
  }
}
