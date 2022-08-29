export interface INewsItem {
  id: number
  title: string
  body: string
  summary: string
  date_published: string
  event_uri: string
  account_name: string
  source_link: string
  is_starred: boolean
  account_logo: string
  source_publication: string
  event_type: string
}

export interface INewsItemProps {
  item: INewsItem
}

export interface INewsFilters {
  starred?: boolean
  accounts?: (string | number | boolean)[]
  event_types?: string[]
}
