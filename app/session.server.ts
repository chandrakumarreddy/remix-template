import { createCookieSessionStorage, redirect } from '~/remix.server'

import decodeToken, { isTokenExpired } from './utils/server/decodeToken.server'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'test'

const {
  getSession: getCookieSession,
  commitSession: commitCookieSession,
  destroySession: destroyCookieSession,
} = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
    secrets: [ENCRYPTION_KEY],
    secure: process.env.NODE_ENV === 'production',
  },
})

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return getCookieSession(cookie)
}

export async function requireAuth(request: Request) {
  const session = await getSession(request)
  const accessToken = session.get('access_token')
  if (!accessToken) throw logout(request)
}

export async function getDecodeTokenData(request: Request) {
  const session = await getSession(request)
  const accessToken = session.get('access_token')
  if (!isTokenExpired(accessToken)) return decodeToken(accessToken)
  return null
}

export async function logout(request: Request, redirectUrl = '/') {
  const session = await getSession(request)
  throw redirect(redirectUrl, {
    headers: {
      'Set-Cookie': await destroyCookieSession(session),
    },
  })
}

export { commitCookieSession, destroyCookieSession, getCookieSession }
