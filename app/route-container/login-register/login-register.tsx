import { Link } from '@remix-run/react'
import type { FC } from 'react'

import fbIcon from '~/assets/images/icons/fb.png'
import instagramIcon from '~/assets/images/icons/instagram.png'
import linkedinIcon from '~/assets/images/icons/linkedin.png'
import twitterIcon from '~/assets/images/icons/twitter.png'
import Logo from '~/assets/images/logo.png'

const socialLinks = [
  {
    icon: fbIcon,
    link: '#',
    alt: 'Click here to know about us in facebook',
    key: 'fb',
  },
  {
    icon: instagramIcon,
    link: '#',
    alt: 'Click here to know about us in instagram',
    key: 'instagram',
  },
  {
    icon: linkedinIcon,
    link: '#',
    alt: 'Click here to know about us in Linkedin',
    key: 'linkedin',
  },
  {
    icon: twitterIcon,
    link: '#',
    alt: 'Click here to know about us in Twitter',
    key: 'twitter',
  },
]

interface ILoginRegisterProps {
  leftSection: FC
  rightSection: FC
}
export default function LoginRegister({
  leftSection: LeftSection,
  rightSection: RightSection,
}: ILoginRegisterProps) {
  return (
    <section id="login-register-page">
      <div className="left-section">
        <Link to="/">
          <img
            src={Logo}
            alt="Orbitx logo"
            width="48px"
            height="48px"
            className="left-section__wrapper-logo"
          />
        </Link>
        <div className="left-section__wrapper">
          <LeftSection />
        </div>
        <div className="left-section__footer">
          <div className="social-links">
            {socialLinks.map((icon) => (
              <a
                target="_blank"
                key={icon.key}
                rel="noreferrer"
                href={icon.link}
              >
                <img src={icon.icon} alt={icon.alt} width="16" height="16" />
              </a>
            ))}
          </div>
          <p className="body-small">
            <a
              target="_blank"
              rel="noreferrer"
              href="/"
              className="external-link"
            >
              Privacy
            </a>{' '}
            and{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="/"
              className="external-link"
            >
              Terms
            </a>
          </p>
          <Link className="body-small bold contact-us" to="/">
            Contact us
          </Link>
        </div>
      </div>
      <div className="right-section">
        <RightSection />
      </div>
    </section>
  )
}
