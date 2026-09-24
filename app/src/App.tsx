import * as React from 'react'
import { MotionConfig } from 'motion/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { TopNav } from '@/components/layout/TopNav'
import { useDistrict } from '@/lib/store'
import { makeScope } from '@/lib/logic'
import { Hero } from '@/sections/Hero'
import { MapSection } from '@/sections/MapSection'
import { Ranking } from '@/sections/Ranking'
import { Gaps } from '@/sections/Gaps'
import { Competition } from '@/sections/Competition'
import { Numbers } from '@/sections/Numbers'
import { Hours } from '@/sections/Hours'
import { Social } from '@/sections/Social'
import { Regulation } from '@/sections/Regulation'
import { Directory } from '@/sections/Directory'
import { Sources } from '@/sections/Sources'

export default function App() {
  const district = useDistrict()
  const S = React.useMemo(() => makeScope(district), [district])
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={150}>
        <TopNav />
        <main className="mx-auto max-w-7xl px-4 sm:px-6">
          <Hero S={S} />
          <MapSection S={S} />
          <Ranking S={S} />
          <Gaps S={S} />
          <Competition S={S} />
          <Numbers S={S} />
          <Hours S={S} />
          <Social S={S} />
          <Regulation S={S} />
          <Directory S={S} />
          <Sources />
        </main>
        <Toaster position="bottom-center" />
      </TooltipProvider>
    </MotionConfig>
  )
}
