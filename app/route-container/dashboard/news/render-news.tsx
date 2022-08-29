import { Button, Group, Loader, ScrollArea } from '@mantine/core'
import { memo, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import searchIcon from '~/assets/images/icons/search.svg'
import starIcon from '~/assets/images/icons/star.png'
import starFilledDarkIcon from '~/assets/images/icons/star-filled-dark.png'
import InputComponent from '~/components/input-component'
import MultiSelectDropDown from '~/components/multi-select-dropdown'
import { useGetEventTypes } from '~/hooks/accounts'
import { useGetNews } from '~/hooks/feed'
import useParentData from '~/hooks/useParentData'
import NewsItem from '~/route-container/dashboard/news/news-item'
import useSalesNews from '~/store/sales/news'
import { INewsItem } from '~/types/news'
import { IRootData } from '~/types/root'

const RenderNews = () => {
  const { ref, inView } = useInView()
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    isLoading,
    isFetching,
  } = useGetNews()
  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])
  return (
    <div className="dashboard-news">
      <NewsFilters />
      <ScrollArea
        classNames={{
          root: 'dashboard-scroll-area-root',
        }}
        scrollbarSize={0}
      >
        {isLoading ? (
          <div className="dashboard-news-fetching">
            <Loader size={64} color="#6c5ce7" />
          </div>
        ) : data?.length ? (
          data?.map((item: INewsItem) => <NewsItem item={item} key={item.id} />)
        ) : !isFetching ? (
          <h3 className="no-results-found">No results found</h3>
        ) : null}
        {hasNextPage ? <div /> : null}
        <div ref={ref} className="load-more-news">
          {(isFetchingNextPage || isFetching) && !isLoading ? (
            <div
              className={`dashboard-news-fetching${
                isFetching && !isFetchingNextPage ? ' fixed' : ''
              }`}
            >
              <Loader size={64} color="#6c5ce7" />
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  )
}

const RenderNewsMemo = memo(RenderNews)

const NewsFilters = () => {
  const showFullArticleRef = useRef(false)
  const rootData = useParentData<IRootData>('', 'root')
  const accounts = [
    ...(rootData?.user.accounts ?? []),
    ...(rootData?.user?.global_accounts?.filter(
      (item) =>
        !rootData?.user.accounts.some((_account) => _account.id === item.id)
    ) ?? []),
  ]
  const _accounts = accounts?.map((account) => ({
    label: account.name,
    value: account.id,
  }))
  const [inputFocus, setInputFocus] = useState(false)
  const [filters, setFilters, selectedNewsItem] = useSalesNews((store) => [
    store.filters,
    store.setFilters,
    store.selectedNewsItem,
  ])
  const { data: eventTypes } = useGetEventTypes()
  const _eventTypes = eventTypes?.map((event) => ({
    label: event,
    value: event,
  }))
  const handleFocus = () => {
    if (!selectedNewsItem?.id) return
    setInputFocus(true)
  }
  useEffect(() => {
    if (selectedNewsItem) {
      if (!showFullArticleRef.current) {
        showFullArticleRef.current = true
        document
          .getElementById(`news-item-${selectedNewsItem?.id}`)
          ?.scrollIntoView()
      }
      window.scrollTo(0, 0)
    }
    return () => {
      if (!selectedNewsItem) {
        showFullArticleRef.current = false
      }
    }
  }, [selectedNewsItem])
  return (
    <div className="dashboard-news_filters">
      <Group direction="row">
        <InputComponent
          placeholder="Search"
          icon={
            <img src={searchIcon} alt="search here" width="20" height="20" />
          }
          inputClassNames={{
            input: `input news-search-input body-regular ${!!selectedNewsItem}`,
            icon: `news-search-icon ${!!selectedNewsItem}`,
          }}
          wrapperClassNames={{
            root: `news-search-root${
              selectedNewsItem ? ' selected' : ''
            } ${inputFocus}`,
          }}
          onFocus={handleFocus}
          onBlur={() => setInputFocus(false)}
          value=""
          onChange={() => {}}
        />
        <MultiSelectDropDown
          label=""
          id="accounts"
          type="Accounts"
          placeholder="Accounts"
          data={_accounts ?? []}
          inputClassNames={{ input: 'input news-account-filter' }}
          notFound="no results found"
          onCloseDropDown={(value) => {
            const _accounts = value.map((item) => item.value)
            setFilters({ accounts: _accounts.length ? _accounts : undefined })
          }}
        />
        <MultiSelectDropDown
          label=""
          id="events"
          type="Events"
          placeholder="Events"
          data={_eventTypes ?? []}
          inputClassNames={{ input: 'input news-events-filter' }}
          notFound="no results found"
          onCloseDropDown={(value) => {
            const events = value.map((item) => item.value) as string[]
            setFilters({ event_types: events.length ? events : undefined })
          }}
        />
      </Group>
      <Button
        classNames={{
          root: `body-small starred-btn ${filters.starred}`,
          rightIcon: 'starred-right-icon',
        }}
        variant="outline"
        rightIcon={
          <img
            src={filters?.starred ? starFilledDarkIcon : starIcon}
            alt="starred icon"
            width="16"
            height="16"
          />
        }
        onClick={() => {
          setFilters({ starred: !filters.starred })
        }}
      >
        Starred
      </Button>
    </div>
  )
}

export default RenderNewsMemo
