export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary p-1 text-primary-foreground shadow-lg shadow-primary/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight">AI<span className="text-primary">ToolHunt</span></span>
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="/submit" className="hover:text-primary transition-colors">Submit Tool</a>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Built with Next.js, Tailwind CSS · © {new Date().getFullYear()} AI Tool Directory
        </p>
      </div>
    </footer>
  )
}
