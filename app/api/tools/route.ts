import { NextRequest, NextResponse } from 'next/server'
import { addTool, queryTools, ToolSubmissionError } from '@/lib/tools-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const result = queryTools({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    pricing: searchParams.get('pricing') || 'all',
    tag: searchParams.get('tag') || '',
    sort: searchParams.get('sort') || 'featured',
    page: Number(searchParams.get('page') || '1'),
    limit: Number(searchParams.get('limit') || '24'),
  })

  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  try {
    const tool = addTool(body)
    return NextResponse.json({ tool }, { status: 201 })
  } catch (error) {
    if (error instanceof ToolSubmissionError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Failed to add tool:', error)
    return NextResponse.json(
      { error: 'Unable to submit tool. Please try again.' },
      { status: 500 }
    )
  }
}
