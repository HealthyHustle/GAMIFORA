import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ForestBackground } from './ForestBackground.tsx'

export function AppLayout() {
  const { pathname } = useLocation()
  const bright = pathname.startsWith('/selamat/')

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname])

  return (
    <>
      <ForestBackground bright={bright} />
      <div key={pathname} className="page-enter">
        <Outlet />
      </div>
    </>
  )
}

