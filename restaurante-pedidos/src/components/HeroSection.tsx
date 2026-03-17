import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-noir-black">
      <Image
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600"
        alt="Restaurante Noir"
        fill
        className="object-cover opacity-40"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <p className="font-inter text-noir-gold text-sm tracking-[0.4em] uppercase mb-6">
          Fine Dining Experience
        </p>
        <h1 className="font-playfair text-[80px] leading-none text-noir-white mb-6 tracking-tight">
          NOIR
        </h1>
        <p className="font-inter text-noir-white/70 text-lg max-w-md leading-relaxed">
          Alta gastronomia em cada detalhe. Ingredientes selecionados, técnica impecável, experiência inesquecível.
        </p>
        <a
          href="#menu"
          className="mt-10 inline-flex items-center gap-2 border border-noir-gold text-noir-gold font-inter text-sm tracking-widest uppercase px-8 py-3 hover:bg-noir-gold hover:text-noir-black transition-all"
        >
          Ver Cardápio
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </div>
    </section>
  )
}
