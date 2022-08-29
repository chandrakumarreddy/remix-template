import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import Header from '~/components/default-header'
import { multiSelectStyles } from '~/components/multi-select-dropdown'
import type { LinksFunction, LoaderFunction } from '~/remix.server'
import NewsSummary from '~/route-container/dashboard/news/news-summary'
import RenderNewsMemo from '~/route-container/dashboard/news/render-news'
import Options from '~/route-container/dashboard/options'
import { getSession, logout } from '~/session.server'
import useSalesNews from '~/store/sales/news'
import styles from '~/styles/dashboard/news.css'
import { isTokenExpired } from '~/utils/server/decodeToken.server'
dayjs.extend(localizedFormat)

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }, ...multiSelectStyles]
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request)
  if (isTokenExpired(session.get('access_token'))) throw await logout(request)
  return null
}

export default function DashboardNews() {
  return (
    <div id="dashboard-news-page">
      <Header children={<Options />} />
      <News />
    </div>
  )
}

const News = () => {
  const selectedNewsItem = useSalesNews((store) => store.selectedNewsItem)
  return (
    <div
      className={`dashboard-news-container ${selectedNewsItem ? 'items' : ''}`}
    >
      <RenderNewsMemo />
      {selectedNewsItem ? <NewsSummary /> : null}
    </div>
  )
}
