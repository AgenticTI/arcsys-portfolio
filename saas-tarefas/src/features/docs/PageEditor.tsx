"use client"
import { useEffect, useRef, useState } from "react"
import type { WikiPage } from "@/data/mock"

type Props = {
  page: WikiPage
  onSave: (updates: { title: string; content: string; updatedAt: string }) => void
  onCancel: () => void
}

export function PageEditor({ page, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(page.title)
  const [content, setContent] = useState(page.content)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  function handleSave() {
    if (!title.trim()) return
    onSave({ title: title.trim(), content, updatedAt: new Date().toISOString() })
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da página"
            className="text-2xl font-bold text-primary bg-transparent border-b border-border focus:border-accent outline-none pb-1 flex-1 mr-4"
          />
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onCancel}
              className="text-sm text-muted hover:text-primary border border-border rounded px-3 py-1.5 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="text-sm bg-accent text-white rounded px-3 py-1.5 hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar
            </button>
          </div>
        </div>
        <hr className="border-border mb-4" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva o conteúdo aqui..."
          className="w-full min-h-[400px] bg-transparent text-primary font-mono text-sm leading-relaxed resize-none outline-none"
        />
      </div>
    </div>
  )
}
