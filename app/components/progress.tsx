import { useTransition } from '@remix-run/react'
import type { ReactElement, RefObject } from 'react'
import { useEffect, useRef } from 'react'

export function useProgress(): RefObject<HTMLDivElement> {
  const el = useRef<HTMLDivElement | null>(null)
  const timeout = useRef<NodeJS.Timeout>()
  const { location } = useTransition()

  useEffect(() => {
    if (!location || !el.current) {
      return
    }

    if (timeout.current) {
      clearTimeout(timeout.current)
    }

    const target = el.current

    target.style.width = `0%`

    const updateWidth = (ms: number) => {
      timeout.current = setTimeout(() => {
        if (!target) {
          return
        }

        const width = parseFloat(target.style.width)
        const percent = !isNaN(width) ? 15 + 0.85 * width : 0
        target.style.width = `${percent}%`

        updateWidth(300)
      }, ms)
    }

    updateWidth(300)

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }

      if (!target || target.style.width === `0%`) {
        return
      }

      target.style.width = `100%`

      timeout.current = setTimeout(() => {
        if (target.style.width !== '100%') {
          return
        }

        target.style.width = ``
      }, 300)
    }
  }, [location])

  return el
}

function Progress(): ReactElement {
  const progress = useProgress()

  return (
    <div className="progress-container">
      <div ref={progress} className="progress-bar" />
    </div>
  )
}

export default Progress
