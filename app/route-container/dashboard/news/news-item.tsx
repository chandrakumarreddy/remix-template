import { ActionIcon, Group } from '@mantine/core'
// import dayjs from 'dayjs'
import { MouseEvent, useState } from 'react'

import starIcon from '~/assets/images/icons/star.png'
import starFilledIcon from '~/assets/images/icons/star-filled.png'
import { useAddToStarEvent } from '~/hooks/feed'
import useSkipFirstRender from '~/hooks/useSkipFirstRender'
import useSalesNews from '~/store/sales/news'
import { INewsItemProps } from '~/types/news'

const NewsItem = ({ item }: INewsItemProps) => {
  const [selectedNewsItem, setSelectedNewsItem] = useSalesNews((store) => [
    store.selectedNewsItem,
    store.setSelectedNewsItem,
  ])
  const isActive = selectedNewsItem?.id === item.id
  return (
    <>
      <div
        id={`news-item-${item.id}`}
        tabIndex={0}
        className={`dashboard-news-item${
          selectedNewsItem ? (isActive ? ' active item' : ' item') : ''
        }`}
        onClick={() => setSelectedNewsItem(item)}
        role="button"
      >
        <div className="news-item-header">
          <div className="news-item-header_left">
            <img
              src={item.account_logo}
              alt="publisher logo"
              width="fit-content"
              height="16"
            />
            <p className="body-small">{item.account_name}</p>
            {/* <div className="header_left-divider" />
            <p className="body-small">
              {dayjs(item.date_published).format('LLL')}
            </p> */}
          </div>
        </div>
        <div>
          <p className="title body-small fw-600">{item.title}</p>
          <p className="body-small description">{item.summary}</p>
        </div>
        <div className="news-item_footer">
          <Group spacing={0}>
            <p className="body-small">{`Event: `}</p>
            <p className="body-extra-small event-type">{item.event_type}</p>
          </Group>
          <StarItem item={item} />
        </div>
      </div>
      <div className="divider" />
    </>
  )
}

const StarItem = ({ item }: INewsItemProps) => {
  const [isStarred, setIsStarred] = useState(() => item.is_starred)
  const addToStarEvent = useAddToStarEvent()
  useSkipFirstRender(() => {
    const isStarredSuccess =
      addToStarEvent.isSuccess &&
      addToStarEvent.variables?.eventId === item.id &&
      addToStarEvent.variables.type === 'add'
    setIsStarred(isStarredSuccess)
  }, [addToStarEvent.isSuccess])
  useSkipFirstRender(() => {
    setIsStarred(item.is_starred)
  }, [item.is_starred])
  return (
    <ActionIcon
      size={36}
      variant="transparent"
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        addToStarEvent.mutate({
          eventId: item.id,
          type: isStarred ? 'remove' : 'add',
        })
      }}
      className={`bookmark ${isStarred ? 'news-item_star' : ''}`}
    >
      <img
        src={isStarred ? starFilledIcon : starIcon}
        alt="star this news"
        width="20"
        height="20"
      />
    </ActionIcon>
  )
}

export default NewsItem
