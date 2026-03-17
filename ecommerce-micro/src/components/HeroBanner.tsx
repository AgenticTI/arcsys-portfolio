// src/components/HeroBanner.tsx
import { useStoreConfig } from '../stores/useStoreConfig'

export function HeroBanner() {
  const { bannerUrl, bannerTitulo, bannerSubtitulo } = useStoreConfig((s) => s.config)

  return (
    <section
      className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${bannerUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight mb-4 leading-tight">
          {bannerTitulo}
        </h1>
        <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
          {bannerSubtitulo}
        </p>
      </div>
    </section>
  )
}
