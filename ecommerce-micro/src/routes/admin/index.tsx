// src/routes/admin/index.tsx
import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from '../__root'
import { AdminHeader } from '../../components/layout/AdminHeader'
import { useStoreConfig } from '../../stores/useStoreConfig'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Button } from '../../components/ui/button'

function AdminPage() {
  const { config, updateConfig, resetConfig } = useStoreConfig()

  return (
    <div className="min-h-screen bg-admin-bg">
      <AdminHeader />

      <main className="max-w-2xl mx-auto px-4 py-12 space-y-10">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Configurações da Loja
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Personalize a identidade visual da sua loja. As mudanças são salvas automaticamente.
          </p>
        </div>

        <div className="space-y-6">
          {/* Identidade */}
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-white/40 font-medium">
              Identidade
            </h2>

            <div className="space-y-2">
              <Label htmlFor="nomeLoja" className="text-white/80 text-sm">
                Nome da loja
              </Label>
              <Input
                id="nomeLoja"
                value={config.nomeLoja}
                onChange={(e) => updateConfig({ nomeLoja: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20"
                placeholder="My Store"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logotipoUrl" className="text-white/80 text-sm">
                URL do logotipo (opcional)
              </Label>
              <Input
                id="logotipoUrl"
                value={config.logotipoUrl ?? ''}
                onChange={(e) => updateConfig({ logotipoUrl: e.target.value || null })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20"
                placeholder="https://..."
              />
              {config.logotipoUrl && (
                <img
                  src={config.logotipoUrl}
                  alt="Logo preview"
                  className="h-10 object-contain mt-2"
                />
              )}
            </div>
          </section>

          {/* Cor principal */}
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-white/40 font-medium">
              Cor Principal
            </h2>

            <div className="flex items-center gap-4">
              <input
                type="color"
                id="corPrincipal"
                value={config.corPrincipal}
                onChange={(e) => updateConfig({ corPrincipal: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              />
              <div className="space-y-1">
                <Label htmlFor="corPrincipal" className="text-white/80 text-sm">
                  Cor dos botões CTA e destaques
                </Label>
                <p className="text-white/40 text-xs font-mono">{config.corPrincipal}</p>
              </div>
            </div>
          </section>

          {/* Banner */}
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-white/40 font-medium">
              Banner Hero
            </h2>

            <div className="space-y-2">
              <Label htmlFor="bannerUrl" className="text-white/80 text-sm">
                URL da imagem do banner
              </Label>
              <Input
                id="bannerUrl"
                value={config.bannerUrl}
                onChange={(e) => updateConfig({ bannerUrl: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20"
                placeholder="/assets/banner-default.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bannerTitulo" className="text-white/80 text-sm">
                Título do banner
              </Label>
              <Input
                id="bannerTitulo"
                value={config.bannerTitulo}
                onChange={(e) => updateConfig({ bannerTitulo: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bannerSubtitulo" className="text-white/80 text-sm">
                Subtítulo do banner
              </Label>
              <Input
                id="bannerSubtitulo"
                value={config.bannerSubtitulo}
                onChange={(e) => updateConfig({ bannerSubtitulo: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20"
              />
            </div>
          </section>

          <div className="pt-4 flex justify-end">
            <Button
              variant="ghost"
              onClick={resetConfig}
              className="text-white/40 hover:text-white hover:bg-white/5"
            >
              Redefinir padrões
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
})
