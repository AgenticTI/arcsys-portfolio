type Props = {
  streak: number
}

export function StreakCard({ streak }: Props) {
  return (
    <div className="bg-surface rounded-2xl p-6 flex items-center gap-6">
      <div className="flex-1">
        <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-1">
          Sequência atual
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-7xl font-black text-text-primary leading-none">
            {streak}
          </span>
          <span className="text-text-secondary text-base font-medium">
            {streak === 1 ? 'dia seguido' : 'dias seguidos'}
          </span>
        </div>
      </div>
      <div className="text-5xl">🔥</div>
    </div>
  )
}
