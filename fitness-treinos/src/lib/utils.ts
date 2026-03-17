import type { Session } from './types'

/** Calcula streak atual: quantos dias consecutivos (até hoje) têm pelo menos 1 sessão */
export function calcStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0

  const sessionDays = new Set(
    sessions.map((s) => s.date.split('T')[0])
  )

  let streak = 0
  const today = new Date()

  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().split('T')[0]
    if (sessionDays.has(key)) {
      streak++
    } else {
      break
    }
  }

  return streak
}

/** Retorna volume total (kg) das sessões nos últimos 7 dias */
export function calcWeekVolume(sessions: Session[]): number {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)
  return sessions
    .filter((s) => new Date(s.date) >= cutoff)
    .reduce((sum, s) => sum + s.totalVolumeKg, 0)
}

/** Retorna quantidade de sessões nos últimos 7 dias */
export function calcWeekSessions(sessions: Session[]): number {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)
  return sessions.filter((s) => new Date(s.date) >= cutoff).length
}

/** Retorna o grupo muscular mais trabalhado nos últimos 7 dias (nome em português) */
export function calcTopMuscle(sessions: Session[]): string {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)
  const recentSets = sessions
    .filter((s) => new Date(s.date) >= cutoff)
    .flatMap((s) => s.sets)

  if (recentSets.length === 0) return 'Peito'

  const keywords: Record<string, string> = {
    supino: 'Peito', peitoral: 'Peito', crucifixo: 'Peito',
    puxada: 'Costas', remada: 'Costas', pulldown: 'Costas',
    agachamento: 'Pernas', leg: 'Pernas', cadeira: 'Pernas',
    ombro: 'Ombros', desenvolvimento: 'Ombros', elevação: 'Ombros',
    bíceps: 'Braços', tríceps: 'Braços', rosca: 'Braços',
    prancha: 'Core', abdominal: 'Core',
  }

  const counts: Record<string, number> = {}
  recentSets.forEach((set) => {
    const lower = set.exerciseName.toLowerCase()
    for (const [kw, group] of Object.entries(keywords)) {
      if (lower.includes(kw)) {
        counts[group] = (counts[group] ?? 0) + 1
        break
      }
    }
  })

  if (Object.keys(counts).length === 0) return 'Peito'
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

/**
 * Retorna um array de { date: string (YYYY-MM-DD), count: number } para os últimos `days` dias.
 * count = número de sessões naquele dia (0 se nenhuma).
 */
export function calcHeatmapData(
  sessions: Session[],
  days: number
): Array<{ date: string; count: number }> {
  const sessionCounts: Record<string, number> = {}
  sessions.forEach((s) => {
    const key = s.date.split('T')[0]
    sessionCounts[key] = (sessionCounts[key] ?? 0) + 1
  })

  const result: Array<{ date: string; count: number }> = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().split('T')[0]
    result.push({ date: key, count: sessionCounts[key] ?? 0 })
  }

  return result
}

/** Formata segundos em MM:SS */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

/** Formata uma data ISO em string legível (ex: "17 mar") */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
  })
}
