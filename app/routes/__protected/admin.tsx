import { Outlet } from '@remix-run/react'

import Header from '~/components/default-header'

export default function Admin() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
