"use client"
import { mockProjects } from "@/data/mock"
import { useTaskStore } from "@/store/useTaskStore"
import { Trash2, Plus } from "lucide-react"

type Props = {
  selectedProjectId: string
  selectedPageId: string | null
  onSelectProject: (projectId: string) => void
  onSelectPage: (pageId: string) => void
  onNewPage: () => void
  onDeletePage: (pageId: string) => void
}

export function DocsSidebar({
  selectedProjectId,
  selectedPageId,
  onSelectProject,
  onSelectPage,
  onNewPage,
  onDeletePage,
}: Props) {
  const pages = useTaskStore((s) => s.pages)
  const projectPages = pages.filter((p) => p.projectId === selectedProjectId)

  return (
    <aside className="w-[200px] flex-shrink-0 border-r border-border flex flex-col h-full overflow-hidden bg-bg-app">
      {/* Projects */}
      <div className="p-4">
        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
          Projetos
        </p>
        <ul className="space-y-1">
          {mockProjects.map((project) => (
            <li key={project.id}>
              <button
                onClick={() => onSelectProject(project.id)}
                className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                  selectedProjectId === project.id
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-muted hover:text-primary hover:bg-card"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <span className="truncate">{project.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border" />

      {/* Pages */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
          Páginas
        </p>
        <ul className="space-y-0.5">
          {projectPages.map((page) => (
            <li key={page.id} className="group relative">
              <button
                onClick={() => onSelectPage(page.id)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded pr-7 truncate transition-colors ${
                  selectedPageId === page.id
                    ? "border-l-2 border-accent text-accent bg-accent/5"
                    : "text-muted hover:text-primary hover:bg-card"
                }`}
              >
                {page.title || "Sem título"}
              </button>
              <button
                onClick={() => onDeletePage(page.id)}
                disabled={projectPages.length <= 1}
                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded text-muted hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-opacity"
                aria-label="Deletar página"
              >
                <Trash2 size={12} />
              </button>
            </li>
          ))}
          {projectPages.length === 0 && (
            <p className="text-xs text-muted py-2 px-2">Nenhuma página.</p>
          )}
        </ul>
      </div>

      {/* New page */}
      <div className="p-3 border-t border-border">
        <button
          onClick={onNewPage}
          className="w-full flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors py-1 px-2"
        >
          <Plus size={14} />
          Nova página
        </button>
      </div>
    </aside>
  )
}
