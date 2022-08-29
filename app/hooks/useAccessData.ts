import { useMatches } from '@remix-run/react'

export const useAccessToken = (): { accessToken: '' } => {
  const matches = useMatches()
  const rootMatch = matches.find((match) => match.id === 'root')
  if (!rootMatch)
    return {
      accessToken: '',
    }
  return {
    accessToken: rootMatch.data?.access_token,
  }
}
