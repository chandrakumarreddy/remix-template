import { useQuery } from '@tanstack/react-query'

import URLS from '~/config/urls'
import useAccountsStore from '~/store/accounts'
import { IAccount, IUserAccount } from '~/types/account'
import { IRootData } from '~/types/root'

import useParentData from './useParentData'

export const useGetUsers = () => {
  const rootData = useParentData<IRootData>('', 'root')
  return useQuery(['dashboard', 'existing-users'], async () => {
    const response = await fetch(
      `${URLS.V1}/tenants/${rootData?.tenant_id}/users`,
      {
        headers: {
          Authorization: `Bearer ${rootData?.accessToken}`,
        },
      }
    )
    if (response.ok) {
      const json = await response.json()
      return json.data.users as unknown as IUserAccount[]
    }
    return []
  })
}

export const useGetAccounts = () => {
  const rootData = useParentData<IRootData>('', 'root')
  const accountsSearch = useAccountsStore((store) => store.accountsSearch)
  return useQuery(
    ['tenant', 'accounts', accountsSearch],
    async () => {
      const response = await fetch(
        `${URLS.V1}/tenants/${rootData?.tenant_id}/users/${rootData?.user_id}/accounts/search`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${rootData?.accessToken}`,
          },
          body: JSON.stringify({ name: accountsSearch }),
        }
      )
      if (response.ok) {
        const json = await response.json()
        return json.data.accounts as unknown as IAccount[]
      }
      return []
    },
    {
      enabled: !!accountsSearch?.length,
    }
  )
}

export const useGetPopularAccounts = () => {
  const rootData = useParentData<IRootData>('', 'root')
  return useQuery(['tenant', 'accounts'], async () => {
    const response = await fetch(
      `${URLS.V1}/tenants/${rootData?.tenant_id}/users/${rootData?.user_id}/accounts/search`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${rootData?.accessToken}`,
        },
        body: JSON.stringify({ name: '' }),
      }
    )
    if (response.ok) {
      const json = await response.json()
      return json.data.accounts as IAccount[]
    }
    return []
  })
}

export const useGetCountries = () => {
  const rootData = useParentData<IRootData>('', 'root')
  return useQuery(['tenant', 'countries'], async () => {
    const response = await fetch(`${URLS.V1}/data/countries`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${rootData?.accessToken}`,
      },
    })
    if (response.ok) {
      const json = await response.json()
      return json.data.countries as string[]
    }
    return []
  })
}
export const useGetEventTypes = () => {
  const rootData = useParentData<IRootData>('', 'root')
  return useQuery(['tenant', 'event-types'], async () => {
    const response = await fetch(`${URLS.V1}/data/types`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${rootData?.accessToken}`,
      },
    })
    if (response.ok) {
      const json = await response.json()
      return json.data.event_types as string[]
    }
    return []
  })
}
