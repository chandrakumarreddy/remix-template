// import FirstSectionBgJpeg from '~/assets/images/home/home-bg.jpeg'
// import FirstSectionBgWebp from '~/assets/images/home/home-bg.webp'
import { Link } from '@remix-run/react'

import FirstSectionRightBgPng from '~/assets/images/home/first-section-right-bg.png'
import FirstSectionRightBgWebp from '~/assets/images/home/first-section-right-bg.webp'
import LogoMainPng from '~/assets/images/logo-main-default.png'
import type { LinksFunction } from '~/remix.server'
import styles from '~/styles/home.css'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'preload', href: LogoMainPng },
    { rel: 'preload', href: FirstSectionRightBgWebp },
  ]
}

export default function Index() {
  return (
    <div id="home-page">
      <section className="firstsection">
        <header>
          <nav className="navbar">
            <Link to="/" className="body">
              <img
                src={LogoMainPng}
                alt="Website Logo"
                width="94"
                height="auto"
              />
            </Link>
            <ul className="navbar-rightsection">
              <li>
                <Link to="/signin/" className="body">
                  Login
                </Link>
              </li>
              <li className="contactus-link">
                <Link to="/" className="body">
                  Contact us
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <div className="content">
          <div className="content-left">
            <h1 className="content-left_title">
              Boost your sales productivity
            </h1>
            <div className="content-left_divider" />
            <p className="body">
              One tool to improve outcomes throughout the deal lifecycle and
              increase sales productivity by more than 25%
            </p>
            <div className="contactus-link">
              <Link to="/" className="body">
                Contact us
              </Link>
            </div>
          </div>
          <picture className="content-right">
            <source srcSet={FirstSectionRightBgPng} type="image/png" />
            <img
              src={FirstSectionRightBgWebp}
              alt="first section background"
              width="618"
              height="618"
            />
          </picture>
        </div>
      </section>
    </div>
  )
}
