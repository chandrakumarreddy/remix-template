import { Outlet, useLoaderData } from '@remix-run/react'

import NoAccountsPng from '~/assets/images/account/no-accounts.png'
import { multiSelectStyles } from '~/components/multi-select-dropdown'
import URLS from '~/config/urls'
import type { ActionFunction, LinksFunction, LoaderArgs } from '~/remix.server'
import AddSalesPerson from '~/route-container/admin/dashboard/add-salesperson'
import Filters from '~/route-container/admin/dashboard/filters'
import RemoveItems from '~/route-container/admin/dashboard/remove-items'
import { getSession } from '~/session.server'
import styles from '~/styles/admin/dashboard.css'
import { isLoggedIn } from '~/utils/server/decodeToken.server'
import fetchHandler from '~/utils/server/fetchHandler.server'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }, ...multiSelectStyles]
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request)
  const formData = await request.formData()
  const _method = formData.get('_method')
  switch (_method) {
    case 'create_user': {
      return await fetchHandler(
        request,
        `${URLS.V1}/tenants/${session.get('tenant_id')}/users`,
        {
          method: 'post',
          body: JSON.stringify({
            users: [JSON.parse(formData.get('data') as string)],
          }),
        }
      )
    }
  }
  return null
}

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request)
  await isLoggedIn(request)
  const response = await fetchHandler(
    request,
    `${URLS.V1}/tenants/${session.get('tenant_id')}/users`
  )
  return response.data.users
}

export default function Dashboard() {
  const accounts = useLoaderData<typeof loader>()
  if (accounts.length) {
    return (
      <>
        <Filters child={<AddSalesPerson />} />
        <Outlet />
        <RemoveItems />
      </>
    )
  }
  return (
    <div id="admin-dashboard-no-accounts">
      <img
        src={NoAccountsPng}
        alt="no accounts added"
        width="300"
        height="268"
      />
      <p className="body">No salesperson added yet</p>
      <AddSalesPerson />
    </div>
  )
}
