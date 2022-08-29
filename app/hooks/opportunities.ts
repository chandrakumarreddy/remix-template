import { useMutation, useQuery } from '@tanstack/react-query'

import queryClient from '~/config/queryClient'
import URLS from '~/config/urls'
import useSalesOpportunities from '~/store/sales/opportunities'
import { IOpportunity } from '~/types/opportunities'
import { IRootData } from '~/types/root'

import useParentData from './useParentData'

export const useGetOpportunities = (type: 'all' | 'starred') => {
  const rootData = useParentData<IRootData>('', 'root')
  const active = useSalesOpportunities((store) => store.activeAccount)
  return useQuery<IOpportunity[]>(
    ['opportunities', active?.id, type],
    async () => {
      const response = await fetch(
        `${URLS.V1}/tenants/${rootData?.tenant_id}/users/${
          rootData?.user_id
        }/accounts/${active?.id}/opportunities/${
          type === 'starred' ? 'starred' : ''
        }`,
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${rootData?.accessToken}`,
          },
        }
      )
      if (response.ok) {
        const json = await response.json()
        return json.data.opportunities
      }
      return []
    }
  )
}

export const useAddToStarOpportunity = () => {
  const rootData = useParentData<IRootData>('', 'root')
  const updateActiveOpportunity = useSalesOpportunities(
    (store) => store.updateActiveOpportunity
  )
  return useMutation(
    ({
      accountId,
      opsId,
      type,
    }: {
      type: 'add' | 'remove'
      accountId: number
      opsId: number
    }) =>
      fetch(
        `${URLS.V1}/tenants/${rootData?.tenant_id}/users/${rootData?.user_id}/accounts/${accountId}/opportunities/${opsId}/star`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${rootData?.accessToken}`,
          },
          body: JSON.stringify({
            action: type,
          }),
        }
      ),
    {
      onSuccess: async (_, variables) => {
        updateActiveOpportunity({ is_starred: variables.type === 'add' })
        await queryClient.refetchQueries([
          'opportunities',
          variables?.accountId,
        ])
      },
    }
  )
}

export const useGetOpportunityPeoples = (opsId: number, name: string) => {
  const rootData = useParentData<IRootData>('', 'root')
  const active = useSalesOpportunities((store) => store.activeAccount)
  return useQuery<IOpportunity>(
    ['opportunity', 'detail', opsId, name],
    async () => {
      const response = await fetch(
        `${URLS.V1}/tenants/${rootData?.tenant_id}/users/${rootData?.user_id}/accounts/${active?.id}/opportunities/${opsId}`,
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${rootData?.accessToken}`,
          },
        }
      )
      if (response.ok) {
        const json = await response.json()
        return json.data.opportunity
      }
      return []
    }
  )
}
