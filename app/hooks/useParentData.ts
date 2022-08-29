import { useMatches } from '@remix-run/react'

export default function useParentData<T>(
  pathname: string,
  id?: string,
  key?: string
): T | null {
  const matches = useMatches()
  let parentMatch
  if (id) {
    parentMatch = matches.find((match) => match.id === id)
  } else {
    parentMatch = matches.find((match) => match.pathname === pathname)
  }
  if (!parentMatch) return null
  return (key ? parentMatch.data?.[key] : parentMatch.data) as T
}
