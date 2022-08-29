import { ActionIcon, Menu } from '@mantine/core'
import { Link, useFetcher } from '@remix-run/react'
import { ReactNode, useMemo } from 'react'

import bellIcon from '~/assets/images/icons/bell.svg'
import helpCenter from '~/assets/images/icons/help-circle.svg'
import menuIcon from '~/assets/images/icons/menu.svg'
import logoPng from '~/assets/images/logo-main.png'
import useParentData from '~/hooks/useParentData'
import { IRootData } from '~/types/root'

export default function Header({ children }: { children?: ReactNode }) {
  const rootData = useParentData<IRootData>('', 'root')
  const renderLogoLink = useMemo(() => {
    if (!rootData?.user_id) return '/'
    else if (rootData?.user.role !== 'salesperson') return '/s/dashboard/'
    return rootData.user.onboarded ? '/s/news/' : '/s/onboarding/'
  }, [])
  return (
    <header className="header">
      <nav className="header_nav">
        <Link to={renderLogoLink}>
          <img src={logoPng} alt="Logo" width="94" height="30" />
        </Link>
        {children}
        <ul className="header_nav__right">
          <ActionIcon variant="outline" size={40} className="action-icon">
            <img
              src={bellIcon}
              alt="click here to view notifications"
              width="20"
              height="20"
            />
          </ActionIcon>
          <ActionIcon variant="outline" size={40} className="action-icon">
            <img
              src={helpCenter}
              alt="click here to contact help center"
              width="20"
              height="20"
            />
          </ActionIcon>
          <UserIcon rootData={rootData} />
        </ul>
      </nav>
    </header>
  )
}

const UserIcon = ({ rootData }: { rootData: IRootData | null }) => {
  const fetcher = useFetcher()
  return (
    <Menu
      trigger="click"
      placement="end"
      position="bottom"
      withArrow
      classNames={{
        body: 'navbar-menu-body',
        itemLabel: 'body-small navbar-item-label',
        item: 'navbar-menu-item',
        itemHovered: 'navbar-item-hovered',
      }}
      control={
        <button className="action-icon action-icon-user  body-small">
          <img src={menuIcon} alt="menu icon" width="16" height="16" />
          <div className="avatar body-extra-small">{rootData?.short_code}</div>
        </button>
      }
    >
      <Menu.Item>My profile</Menu.Item>
      <Menu.Item>Manage accounts</Menu.Item>
      <Menu.Item
        onClick={() =>
          fetcher.submit(null, { method: 'post', action: '/logout' })
        }
      >
        Logout
      </Menu.Item>
    </Menu>
  )
}
