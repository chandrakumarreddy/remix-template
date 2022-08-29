import { Link, useLocation } from '@remix-run/react'

import newsIcon from '~/assets/images/icons/news.png'
import newsActiveIcon from '~/assets/images/icons/news-active.png'
import opportunitiesIcon from '~/assets/images/icons/opportunities.png'
import opportunitiesActiveIcon from '~/assets/images/icons/opportunities-active.png'
import useSalesNews from '~/store/sales/news'

const Options = () => {
  const { pathname } = useLocation()
  const setSelectedNewsItem = useSalesNews((store) => store.setSelectedNewsItem)
  return (
    <div className="dashboard-options">
      <Link
        to="/s/news/"
        className={`body fw-600 dashboard-options_item${
          pathname.includes('/s/news') ? ' active' : ''
        }`}
        onClick={() => setSelectedNewsItem(null)}
      >
        <img
          src={pathname.includes('/s/news') ? newsActiveIcon : newsIcon}
          alt="news icon"
          width="24"
          height="24"
          className="mr-8"
        />
        News
      </Link>
      <Link
        to="/s/opportunities/"
        className={`body fw-600 dashboard-options_item${
          pathname.includes('/s/opportunities') ? ' active' : ''
        }`}
      >
        <img
          src={
            pathname.includes('/s/opportunities')
              ? opportunitiesActiveIcon
              : opportunitiesIcon
          }
          alt="opportunities icon"
          width="24"
          height="24"
          className="mr-8"
        />
        Opportunities
      </Link>
    </div>
  )
}

export default Options
