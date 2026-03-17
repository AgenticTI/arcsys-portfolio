'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useFitnessStore } from '@/store/fitness'

// --- Inline SVG icons ---

function IconHome({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      width={24}
      height={24}
      style={{ color: active ? '#A5FD18' : 'rgba(235,235,245,0.30)' }}
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V13h6v8" />
    </svg>
  )
}

function IconDumbbell({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={24}
      height={24}
      style={{ color: active ? '#A5FD18' : 'rgba(235,235,245,0.30)' }}
    >
      <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
    </svg>
  )
}

function IconActivity({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={24}
      height={24}
      style={{ color: active ? '#A5FD18' : 'rgba(235,235,245,0.30)' }}
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

function IconPerson({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      width={24}
      height={24}
      style={{ color: active ? '#A5FD18' : 'rgba(235,235,245,0.30)' }}
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="#000" width={20} height={20}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

// --- Tab item ---

type TabItemProps = {
  href: string
  label: string
  active: boolean
  icon: React.ReactNode
}

function TabItem({ href, label, active, icon }: TabItemProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center flex-1"
      style={{ gap: '3px' }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          background: active ? 'rgba(165,253,24,0.10)' : 'transparent',
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 500,
          color: active ? '#A5FD18' : 'rgba(235,235,245,0.30)',
        }}
      >
        {label}
      </span>
    </Link>
  )
}

// --- Main component ---

export function BottomTabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const activeWorkout = useFitnessStore((s) => s.activeWorkout)

  const isHome = pathname === '/'
  const isWorkouts = pathname.startsWith('/workouts') && !pathname.includes('/active')
  const isActive = pathname.includes('/active')
  const isHistory = pathname.startsWith('/history')
  const isProfile = pathname.startsWith('/profile')

  function handlePlayPress() {
    if (activeWorkout) {
      router.push(`/workouts/${activeWorkout.workoutId}/active`)
    } else {
      router.push('/workouts')
    }
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center"
    >
      <div
        style={{
          width: '100%',
          maxWidth: 390,
          background: 'rgba(18,18,18,0.88)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          borderTop: '0.5px solid rgba(255,255,255,0.08)',
          paddingTop: 8,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        {/* Início */}
        <TabItem
          href="/"
          label="Início"
          active={isHome}
          icon={<IconHome active={isHome} />}
        />

        {/* Treinos */}
        <TabItem
          href="/workouts"
          label="Treinos"
          active={isWorkouts}
          icon={<IconDumbbell active={isWorkouts} />}
        />

        {/* Center play button */}
        <div className="flex flex-col items-center flex-1">
          <button
            onClick={handlePlayPress}
            aria-label="Iniciar treino"
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#A5FD18',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -16,
              boxShadow: isActive
                ? '0 4px 32px rgba(165,253,24,0.70)'
                : '0 4px 20px rgba(165,253,24,0.40)',
            }}
          >
            <span style={{ marginLeft: 2, display: 'flex' }}>
              <IconPlay />
            </span>
          </button>
        </div>

        {/* Progresso */}
        <TabItem
          href="/history"
          label="Progresso"
          active={isHistory}
          icon={<IconActivity active={isHistory} />}
        />

        {/* Perfil */}
        <TabItem
          href="/profile"
          label="Perfil"
          active={isProfile}
          icon={<IconPerson active={isProfile} />}
        />
      </div>
    </nav>
  )
}
