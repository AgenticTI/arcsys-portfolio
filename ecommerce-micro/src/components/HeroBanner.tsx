// src/components/HeroBanner.tsx
import { useStoreConfig } from '../stores/useStoreConfig'

export function HeroBanner() {
  const { bannerTitulo, bannerSubtitulo } = useStoreConfig((s) => s.config)
  const words = bannerTitulo.split(' ')

  // Delays: eyebrow=0.3s, words start at 0.5s (+0.25s each), subtitle=2.2s, ctas=2.4s, badges=2.6s, scrollcue=2.8s
  const wordDelays = words.map((_, i) => 0.5 + i * 0.25)

  return (
    <section
      className="relative w-full min-h-screen flex items-center overflow-hidden bg-dark-surface"
      style={{ perspective: '1000px' }}
    >
      {/* Animated gradient fallback (always present, video overlaps it) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, #0a1628 0%, #000 60%), radial-gradient(ellipse at 80% 20%, #0d2040 0%, transparent 50%)',
          animation: 'drift 18s ease-in-out infinite alternate',
        }}
      />

      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ opacity: 0.35 }}
      >
        <source src="/src/assets/hero-loop.mp4" type="video/mp4" />
      </video>

      {/* Cinematic overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.2) 100%), linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)',
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
        {/* Eyebrow label */}
        <p
          className="text-xs font-semibold uppercase tracking-[0.1em] text-white/50 mb-4"
          style={{ opacity: 0, animation: 'slideUp 0.5s ease forwards', animationDelay: '0.3s' }}
        >
          Coleção 2026
        </p>

        {/* Title — word reveal */}
        <h1
          className="text-white mb-6 leading-[1.05] tracking-[-3px]"
          style={{ fontSize: 'clamp(52px, 7vw, 96px)', fontWeight: 800 }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              className="inline-block mr-[0.25em]"
              style={{
                opacity: 0,
                animation: 'wordReveal 0.5s ease forwards',
                animationDelay: `${wordDelays[i]}s`,
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/70 mb-10 max-w-lg"
          style={{ fontSize: '17px', opacity: 0, animation: 'slideUp 0.6s ease forwards', animationDelay: '2.2s' }}
        >
          {bannerSubtitulo}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap gap-4"
          style={{ opacity: 0, animation: 'slideUp 0.6s ease forwards', animationDelay: '2.4s' }}
        >
          <a
            href="#catalog"
            className="px-8 py-3.5 rounded-full text-white font-semibold text-sm transition-transform hover:-translate-y-px"
            style={{ background: 'var(--cor-principal)' }}
          >
            Ver Catálogo
          </a>
          <a
            href="#featured"
            className="px-8 py-3.5 rounded-full font-semibold text-sm text-white transition-transform hover:-translate-y-px"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            Destaques
          </a>
        </div>
      </div>

      {/* Badge strip */}
      <div
        className="absolute bottom-20 left-0 right-0 z-10"
        style={{ opacity: 0, animation: 'fadeIn 0.6s ease forwards', animationDelay: '2.6s' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="inline-flex gap-6 px-6 py-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {['Frete Grátis', 'Pagamento Seguro', 'Devoluções em 30 dias'].map((label) => (
              <span key={label} className="text-xs font-medium text-white/70">{label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        style={{ opacity: 0, animation: 'fadeIn 0.6s ease forwards', animationDelay: '2.8s' }}
      >
        <span className="text-[10px] text-white/30 uppercase tracking-widest">scroll</span>
        <div
          className="w-px h-8 bg-white/20"
          style={{ animation: 'float 2s ease-in-out infinite' }}
        />
      </div>
    </section>
  )
}
