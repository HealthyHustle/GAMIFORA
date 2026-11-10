import { useEffect, useState } from 'react'

export type Mood = 'wave' | 'cheer' | 'jump' | 'pose1' | 'pose2' | 'pose3' | 'pose4'

const SRC: Record<Mood, string> = {
  wave: '/assets/POSE_1-removebg-preview.png',
  cheer: '/assets/POSE_3-removebg-preview.png',
  jump: '/assets/POSE_3-removebg-preview.png',
  pose1: '/assets/POSE_1-removebg-preview.png',
  pose2: '/assets/POSE_2-removebg-preview.png',
  pose3: '/assets/POSE_3-removebg-preview.png',
  pose4: '/assets/POSE_4-removebg-preview.png',
}

const CYCLE_POSES: Mood[] = ['pose1', 'pose3', 'pose2', 'pose4']

interface AvatarProps {
  mood?: Mood
  cycle?: boolean
  className?: string
  animation?: 'idle' | 'jump' | 'none'
  alt?: string
}

export function Avatar({
  mood = 'wave',
  cycle = false,
  className = '',
  animation = 'idle',
  alt = 'Karakter Petualang',
}: AvatarProps) {
  const [cycleIndex, setCycleIndex] = useState(0)

  useEffect(() => {
    if (!cycle) return
    const t = window.setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % CYCLE_POSES.length)
    }, 2800)
    return () => window.clearInterval(t)
  }, [cycle])

  const shown: Mood = cycle ? CYCLE_POSES[cycleIndex] : mood

  return (
    <div className={`avatar avatar--${animation} ${className}`}>
      <span className="avatar__shadow" aria-hidden="true" />
      <div className="avatar__body">
        <img key={shown} className="avatar__img" src={SRC[shown]} alt={alt} draggable={false} />
      </div>
    </div>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return <img className={`logo ${className}`} src="/assets/logo.png" alt="Logo GAMIFORA" draggable={false} />
}

export function Frog() {
  return null
}
