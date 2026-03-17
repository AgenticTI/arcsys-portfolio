'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return
      const y = Math.min(window.scrollY * 0.3, 100)
      bgRef.current.style.transform = `scale(1.04) translateY(${y}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden flex flex-col justify-end">
      {/* Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 scale-[1.04] transition-none"
        style={{ willChange: 'transform' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800"
          alt="Restaurante Noir"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, rgba(9,8,6,0.2) 0%, rgba(9,8,6,0.5) 40%, rgba(9,8,6,0.92) 100%)',
          }}
        />
      </div>

      {/* Header gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(9,8,6,0.85) 0%, transparent 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 grid grid-cols-2 items-end gap-0 px-14 pb-16">
        {/* Left */}
        <div>
          <p className="font-body text-noir-gold text-[10px] tracking-[0.4em] uppercase mb-5">
            Bem-vindo ao Noir
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-cormorant text-[clamp(52px,6vw,88px)] font-light leading-[1.02] text-noir-white tracking-tight mb-8"
          >
            Nosso cardápio<br />
            promete deleitar<br />
            <em className="text-noir-gold">todos os sentidos</em>
          </motion.h1>
          <p className="font-body text-noir-white/80 text-sm leading-relaxed max-w-sm mb-8">
            Cada prato é uma celebração de sofisticação e arte, oferecendo uma experiência inesquecível que alia inovação e tradição.
          </p>
          <a
            href="#menu"
            className="inline-flex items-center gap-3 border border-noir-gold text-noir-gold font-body text-[10px] tracking-[0.3em] uppercase px-8 py-3.5 hover:bg-noir-gold hover:text-noir-black transition-all"
          >
            Ver Cardápio
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-6">
          <p className="font-script text-[38px] text-noir-white/30 text-right leading-tight">
            a arte em<br />cada prato
          </p>
          <div className="border border-noir-gold/30 px-6 py-4 text-center">
            <span className="block font-body text-[9px] tracking-[0.35em] uppercase text-noir-gold mb-1">
              Reconhecimento
            </span>
            <strong className="font-cormorant text-2xl font-light text-noir-white">
              Top 50 Brasil
            </strong>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-10">
        <motion.div
          className="w-px bg-noir-gold/40"
          animate={{ height: [40, 24, 40] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ height: 40 }}
        />
        <span className="font-body text-[9px] tracking-[0.35em] uppercase text-noir-white/35">
          Explorar
        </span>
      </div>
    </section>
  )
}
