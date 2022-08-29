import create from 'zustand'

import { INewsFilters, INewsItem } from '~/types/news'

interface IUseSalesNews {
  selectedNewsItem: INewsItem | null
  setSelectedNewsItem: (val: INewsItem | null) => void
  filters: INewsFilters
  setFilters: (val: INewsFilters) => void
  pageNumber: number
  setPageNumber: (val: number) => void
}

const useSalesNews = create<IUseSalesNews>((set) => ({
  selectedNewsItem: null,
  setSelectedNewsItem: (val: INewsItem | null) =>
    set(() => ({
      selectedNewsItem: val,
    })),
  filters: { starred: false },
  setFilters: (val: INewsFilters) =>
    set((state) => {
      const filters = { ...state.filters, ...val }
      // @ts-ignore
      Object.keys(filters).forEach((key: keyof typeof filters) => {
        if (filters[key] === undefined) delete filters[key]
      })
      return {
        filters,
      }
    }),
  pageNumber: 0,
  setPageNumber: (val: number) =>
    set(() => ({
      pageNumber: val,
    })),
}))

export default useSalesNews
