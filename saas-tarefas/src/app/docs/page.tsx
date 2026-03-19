"use client"
import { useState, useEffect } from "react"
import { mockProjects } from "@/data/mock"
import { useTaskStore } from "@/store/useTaskStore"
import { DocsSidebar } from "@/features/docs/DocsSidebar"
import { PageViewer } from "@/features/docs/PageViewer"
import { PageEditor } from "@/features/docs/PageEditor"
import type { WikiPage } from "@/data/mock"

export default function DocsPage() {
  const { pages, addPage, updatePage, deletePage } = useTaskStore()
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0].id)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [draftPage, setDraftPage] = useState<WikiPage | null>(null)

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
      <DocsSidebar
        selectedProjectId={selectedProjectId}
        selectedPageId={selectedPageId}
        onSelectProject={handleSelectProject}
        onSelectPage={handleSelectPage}
        onNewPage={handleNewPage}
        onDeletePage={handleDeletePage}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {activePage && isEditing ? (
          <PageEditor page={activePage} onSave={handleSave} onCancel={handleCancel} />
        ) : activePage ? (
          <PageViewer page={activePage} onEdit={() => setIsEditing(true)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted">
            <p className="text-sm">Nenhuma página ainda. Crie a primeira.</p>
            <button
              onClick={handleNewPage}
              className="text-sm bg-accent text-white rounded px-4 py-2 hover:bg-accent/90 transition-colors"
            >
              + Nova página
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
