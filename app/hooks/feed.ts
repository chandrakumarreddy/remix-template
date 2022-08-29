import { useDebouncedValue } from '@mantine/hooks'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'

import queryClient from '~/config/queryClient'
import URLS from '~/config/urls'
import useSalesNews from '~/store/sales/news'
import { INewsItem } from '~/types/news'
import { IRootData } from '~/types/root'

import useParentData from './useParentData'

export const useGetNews = () => {
  const rootData = useParentData<IRootData>('', 'root')
  const filters = useSalesNews((store) => store.filters)
  const [_filters] = useDebouncedValue(filters, 300)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [JSON.stringify(_filters)])
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    isLoading,
    refetch,
    isFetching,
  } = useInfiniteQuery(
    ['tenant', 'news', JSON.stringify(_filters)],
    async ({ pageParam = 1 }) => {
      const response = await fetch(
        `${URLS.V1}/tenants/${rootData?.tenant_id}/users/${rootData?.user_id}/feed`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${rootData?.accessToken}`,
          },
          body: JSON.stringify({
            filter: _filters,
            limit: 8,
            page: pageParam,
          }),
        }
      )
      if (response.ok) {
        queryClient.setQueryData(
          ['tenant', 'news', 'page-number'],
          (oldData: number | undefined) => (oldData ? oldData + 1 : 2)
        )
        return await response.json()
      }
      return []
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      getNextPageParam: (firstPage) =>
        firstPage?.data.events.length
          ? queryClient.getQueryData(['tenant', 'news', 'page-number'])
          : undefined,
    }
  )
  return {
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    data: data?.pages
      .reduce((acc, cur) => {
        if (cur.data) {
          acc.push(...cur.data.events)
        }
        return acc
      }, [])
      .flat(Infinity)
      .filter(
        (v1: INewsItem, i: number, arr: INewsItem[]) =>
          arr.findIndex((v2) => v2.id === v1.id) === i
      ),
  }
}

export const useAddToStarEvent = () => {
  const rootData = useParentData<IRootData>('', 'root')
  return useMutation(
    ({ eventId, type }: { type: 'add' | 'remove'; eventId: number }) =>
      fetch(
        `${URLS.V1}/tenants/${rootData?.tenant_id}/users/${rootData?.user_id}/events/${eventId}/star`,
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
      onSuccess: async () => {
        queryClient.setQueryData(['tenant', 'news', 'page-number'], () => 1)
        await queryClient.refetchQueries(['tenant', 'news'])
      },
    }
  )
}
