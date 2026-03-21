"use client"
import { useState, useEffect } from "react"
import { mockProjects } from "@/data/mock"
import { useTaskStore } from "@/store/useTaskStore"
import { DocsSidebar } from "@/features/docs/DocsSidebar"
import { PageViewer } from "@/features/docs/PageViewer"
import { PageEditor } from "@/features/docs/PageEditor"
import { Menu } from "lucide-react"
import type { WikiPage } from "@/data/mock"

export default function DocsPage() {
  const { pages, addPage, updatePage, deletePage } = useTaskStore()
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0].id)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [draftPage, setDraftPage] = useState<WikiPage | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Auto-select first page when project changes, or clear selectedPageId if page was deleted
  useEffect(() => {
    const projectPages = pages.filter((p) => p.projectId === selectedProjectId)
    const stillExists = projectPages.some((p) => p.id === selectedPageId)
    if (!stillExists) {
      setSelectedPageId(projectPages[0]?.id ?? null)
      setIsEditing(false)
      setDraftPage(null)
    }
  }, [selectedProjectId, pages, selectedPageId])

  const activePage = draftPage ?? pages.find((p) => p.id === selectedPageId) ?? null

  function handleSelectProject(projectId: string) {
    setSelectedProjectId(projectId)
  }

  function handleSelectPage(pageId: string) {
    setSelectedPageId(pageId)
    setIsEditing(false)
    setDraftPage(null)
  }

  function handleNewPage() {
    const newPage: WikiPage = {
      id: crypto.randomUUID(),
      projectId: selectedProjectId,
      title: "",
      content: "",
      updatedAt: new Date().toISOString(),
    }
    setDraftPage(newPage)
    setIsEditing(true)
  }

  function handleDeletePage(pageId: string) {
    const remaining = pages.filter(
      (p) => p.projectId === selectedProjectId && p.id !== pageId
    )
    deletePage(pageId)
    setSelectedPageId(remaining[0]?.id ?? null)
    setIsEditing(false)
    setDraftPage(null)
  }

  function handleSave(updates: { title: string; content: string; updatedAt: string }) {
    if (draftPage) {
      addPage({ ...draftPage, ...updates })
      setSelectedPageId(draftPage.id)
      setDraftPage(null)
    } else if (selectedPageId) {
      updatePage(selectedPageId, updates)
    }
    setIsEditing(false)
  }

  function handleCancel() {
    setDraftPage(null)
    setIsEditing(false)
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <DocsSidebar
          selectedProjectId={selectedProjectId}
          selectedPageId={selectedPageId}
          onSelectProject={handleSelectProject}
          onSelectPage={handleSelectPage}
          onNewPage={handleNewPage}
          onDeletePage={handleDeletePage}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full w-[240px]">
            <DocsSidebar
              selectedProjectId={selectedProjectId}
              selectedPageId={selectedPageId}
              onSelectProject={handleSelectProject}
              onSelectPage={(pageId) => {
                handleSelectPage(pageId)
                setSidebarOpen(false)
              }}
              onNewPage={() => {
                handleNewPage()
                setSidebarOpen(false)
              }}
              onDeletePage={handleDeletePage}
            />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile menu button */}
        <div className="flex md:hidden items-center px-4 py-2 border-b border-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-bg-card text-text-muted hover:text-text-primary transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-2 text-sm font-medium text-text-secondary">Documents</span>
        </div>

        {activePage && isEditing ? (
          <PageEditor page={activePage} onSave={handleSave} onCancel={handleCancel} />
        ) : activePage ? (
          <PageViewer page={activePage} onEdit={() => setIsEditing(true)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-text-muted">
            <p className="text-sm">No pages yet. Create the first one.</p>
            <button
              onClick={handleNewPage}
              className="text-sm bg-accent text-black rounded px-4 py-2 hover:bg-accent/90 transition-colors"
            >
              + New page
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
