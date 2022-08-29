import { Global, MantineProvider } from '@mantine/core'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from '@remix-run/react'
import { QueryClientProvider } from '@tanstack/react-query'

import InterBold from '~/assets/fonts/Inter-Bold.ttf'
import InterMedium from '~/assets/fonts/Inter-Medium.ttf'
import InterRegular from '~/assets/fonts/Inter-Regular.ttf'
import InterSemiBold from '~/assets/fonts/Inter-SemiBold.ttf'
import AppleTouchIcon from '~/assets/images/apple-touch-icon.png'
import favicon16 from '~/assets/images/favicon-16x16.png'
import favicon32 from '~/assets/images/favicon-32x32.png'
import type { LinksFunction, LoaderArgs, MetaFunction } from '~/remix.server'
import globalStyles from '~/styles/global.css'

import Header from './components/default-header'
import Progress from './components/progress'
import queryClient from './config/queryClient'
import URLS from './config/urls'
import { json, redirect } from './remix.server'
import { getSession } from './session.server'
import { IRootData } from './types/root'
import decodeToken from './utils/server/decodeToken.server'
import fetchHandler from './utils/server/fetchHandler.server'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: globalStyles }]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'OrbitX',
  viewport: 'width=device-width,initial-scale=1',
})

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request)
  const accessToken = session.get('access_token')
  const url = new URL(request.url)
  if (accessToken) {
    const data = decodeToken(accessToken)
    if (data?.role === 'salesperson' && !url.pathname.includes('/s/')) {
      const _url = session.get('onboarded') ? '/s/onboarding/' : '/s/news/'
      return redirect(_url)
    } else if (url.pathname === '/') {
      return redirect('/a/dashboard/')
    }
    const response = await fetchHandler(
      request,
      `${URLS.V1}/tenants/${data?.tenant_id}/users/${data?.user_id}`
    )
    return json({
      accessToken,
      user: response.data.user,
      ...data,
    })
  }
  return null
}

export default function App() {
  return (
    <MantineProvider
      theme={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <html lang="en">
        <head>
          <link
            rel="preload"
            as="font"
            href={InterRegular}
            type="font/ttf"
            crossOrigin="true"
          />
          <link
            rel="preload"
            as="font"
            href={InterMedium}
            type="font/ttf"
            crossOrigin="true"
          />
          <link
            rel="preload"
            as="font"
            href={InterSemiBold}
            type="font/ttf"
            crossOrigin="true"
          />
          <link
            rel="preload"
            as="font"
            href={InterBold}
            type="font/ttf"
            crossOrigin="true"
          />
          <meta name="format-detection" content="telephone=no" />
          <link rel="apple-touch-icon" sizes="180x180" href={AppleTouchIcon} />
          <link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
          <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
          <Meta />
          <Links />
        </head>
        <body>
          <Global
            styles={[
              {
                '@font-face': {
                  fontFamily: 'Inter',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontDisplay: 'swap',
                  src: `local(''),
                    url('${InterRegular}') format('truetype')`,
                  ascentOverride: '80%',
                  descentOverride: '20%',
                  lineGapOverride: '0%',
                },
              },
              {
                '@font-face': {
                  fontFamily: 'Inter',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontDisplay: 'swap',
                  src: `local(''),
                    url('${InterMedium}') format('truetype')`,
                  ascentOverride: '80%',
                  descentOverride: '20%',
                  lineGapOverride: '0%',
                },
              },
              {
                '@font-face': {
                  fontFamily: 'Inter',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontDisplay: 'swap',
                  src: `local(''),
                    url('${InterSemiBold}') format('truetype')`,
                  ascentOverride: '80%',
                  descentOverride: '20%',
                  lineGapOverride: '0%',
                },
              },
              {
                '@font-face': {
                  fontFamily: 'Inter',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  fontDisplay: 'swap',
                  src: `local(''),
                    url('${InterBold}') format('truetype')`,
                  ascentOverride: '80%',
                  descentOverride: '20%',
                  lineGapOverride: '0%',
                },
              },
            ]}
          />
          <Progress />
          <QueryClientProvider client={queryClient}>
            <RenderHeader />
            <Outlet />
          </QueryClientProvider>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </MantineProvider>
  )
}

const RenderHeader = () => {
  const loaderData = useLoaderData<IRootData>()
  const { pathname } = useLocation()
  if (!loaderData?.accessToken || /^\/s/.test(pathname)) return null
  return <Header />
}
