import type { DependencyList, EffectCallback } from 'react'
import { useEffect, useRef } from 'react'

const useSkipFirstRender = (
  callback: EffectCallback,
  dependencies: DependencyList
): void => {
  const ref = useRef(false)
  useEffect(() => {
    if (!ref.current) {
      ref.current = true
      return
    }
    callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

export default useSkipFirstRender
