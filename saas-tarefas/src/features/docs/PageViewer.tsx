"use client"
import { mockProjects } from "@/data/mock"
import { Edit } from "lucide-react"
import type { WikiPage } from "@/data/mock"

type Props = {
  page: WikiPage
  onEdit: () => void
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return "today"
  const rtf = new Intl.RelativeTimeFormat("en", { style: "long" })
  if (days < 30) return rtf.format(-days, "day")
  return rtf.format(-Math.floor(days / 30), "month")
}

export function PageViewer({ page, onEdit }: Props) {
  const project = mockProjects.find((p) => p.id === page.projectId)

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-bold text-primary">{page.title}</h1>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-primary border border-border rounded px-3 py-1.5 transition-colors flex-shrink-0 ml-4"
          >
            <Edit size={14} />
            Edit
          </button>
        </div>
        <p className="text-sm text-muted mb-4">
          Updated {relativeTime(page.updatedAt)} · {project?.name}
        </p>
        <hr className="border-border mb-6" />
        <p className="text-primary whitespace-pre-wrap leading-relaxed">{page.content}</p>
      </div>
    </div>
  )
}
