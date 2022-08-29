import { Button } from '@mantine/core'
import { useEffect, useMemo } from 'react'
import { useFilters, useGlobalFilter } from 'react-table'
import { useSortBy, useTable } from 'react-table'

import sortIcon from '~/assets/images/icons/sort-icon.svg'
import URLS from '~/config/urls'
import { useGetCountries } from '~/hooks/accounts'
import useParentData from '~/hooks/useParentData'
import type { ActionFunction, LinksFunction } from '~/remix.server'
import DeleteAccount from '~/route-container/admin/dashboard/delete-account'
import EditAccount from '~/route-container/admin/dashboard/edit-account'
import InvitationStatusFilter from '~/route-container/admin/dashboard/invitation-status-filter'
import {
  TableHeadCheckbox,
  TableRow,
} from '~/route-container/admin/dashboard/list-users'
import { getSession } from '~/session.server'
import useAccountsStore from '~/store/accounts'
import styles from '~/styles/admin/dashboard/index.css'
import { IUserAccount } from '~/types/account'
import fetchHandler from '~/utils/server/fetchHandler.server'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

const columns = [
  {
    Header: 'NAME',
    accessor: 'name',
  },
  {
    Header: 'EMAIL',
    accessor: 'email',
  },
  {
    Header: 'REGION',
    accessor: 'country',
  },
  {
    Header: 'ACCOUNTS',
    accessor: '_accounts',
  },
  {
    Header: 'INVITATION STATUS',
    accessor: 'activated',
    Filter: InvitationStatusFilter,
  },
  {
    Header: '',
    accessor: 'col6',
  },
]

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request)
  const formData = await request.formData()
  const _method = formData.get('_method')
  switch (_method) {
    case 'update_user': {
      return await fetchHandler(
        request,
        `${URLS.V1}/tenants/${session.get('tenant_id')}/users/${formData.get(
          'id'
        )}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            user: JSON.parse(formData.get('data') as string),
          }),
        }
      )
    }
    case 'delete_user': {
      return await fetchHandler(
        request,
        `${URLS.V1}/tenants/${session.get('tenant_id')}/users/`,
        {
          method: 'delete',
          body: JSON.stringify({ users: [formData.get('user_id')] }),
        }
      )
    }
    default:
      return null
  }
}

export default function AdminDashboard() {
  return (
    <>
      <ManageUsers />
      <EditAccount />
      <DeleteAccount />
    </>
  )
}

function ManageUsers() {
  const filters = useAccountsStore((store) => store.filters)
  const accounts = useParentData<IUserAccount[]>(
    '',
    'routes/__protected/__admin/a/dashboard'
  )
  const data = useMemo(
    () =>
      accounts!.map((account) => {
        const hasAccounts = [...account.accounts, ...account.global_accounts]
        const slicedAccounts = hasAccounts.slice(1).length
        return {
          ...account,
          name: `${account.fname} ${account.sname}`,
          fname: account.fname,
          sname: account.sname,
          activated: account.activated ? 'Signed up' : 'Did not sign up',
          statusClass: account.activated ? 'success' : 'warning',
          _accounts: hasAccounts.length ? (
            <>
              {`${hasAccounts[0].short_name}${
                slicedAccounts > 0 ? '  + ' : ''
              }`}
              <Button
                variant="white"
                className="more-accounts-btn body-small"
                type="button"
              >
                {slicedAccounts > 0 ? ` ${slicedAccounts} more` : ''}
              </Button>
            </>
          ) : (
            <>{'-'}</>
          ),
        }
      }),
    [accounts?.length]
  )
  const sortees = useMemo(
    () => [
      {
        id: 'email',
        desc: false,
      },
    ],
    []
  )
  useGetCountries()
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    //@ts-ignore
    setGlobalFilter,
  } = useTable(
    {
      //@ts-ignore
      columns,
      data,
      initialState: {
        //@ts-ignore
        sortBy: sortees,
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  )
  useEffect(() => {
    const timer = setTimeout(() => setGlobalFilter(filters.searchKey), 300)
    return () => {
      clearTimeout(timer)
    }
  }, [filters.searchKey])
  return (
    <>
      <div id="manage-users">
        <table {...getTableProps()} className="manage-table">
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={String(index)}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...(index <= 2
                      ? //@ts-ignore
                        column.getHeaderProps(column.getSortByToggleProps())
                      : column.getHeaderProps())}
                    key={column.id}
                  >
                    <div className="row-flex">
                      {column.Header === 'NAME' && (
                        <TableHeadCheckbox data={data} />
                      )}
                      <p className="th-content body-small">
                        {column.render('Header')}
                      </p>
                      {/* @ts-ignore */}
                      {column.Filter ? column.render('Filter') : null}
                      {index <= 2 && (
                        <img
                          src={sortIcon}
                          alt=""
                          width="12"
                          height="12"
                          className="sort-icon"
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return <TableRow row={row} key={row.original.id} />
            })}
          </tbody>
        </table>
      </div>
      <EditAccount />
      <DeleteAccount />
    </>
  )
}
