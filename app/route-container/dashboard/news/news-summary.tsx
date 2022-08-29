import { ActionIcon, Button, Group } from '@mantine/core'
// import dayjs from 'dayjs'
import type { MouseEvent } from 'react'

import shareIcon from '~/assets/images/icons/share.png'
import starIcon from '~/assets/images/icons/star.png'
import starFilledIcon from '~/assets/images/icons/star-filled.png'
import { useAddToStarEvent } from '~/hooks/feed'
import useSalesNews from '~/store/sales/news'

const NewsSummary = () => {
  const addToStarEvent = useAddToStarEvent()
  const [selectedNewsItem, setSelectedNewsItem] = useSalesNews((store) => [
    store.selectedNewsItem,
    store.setSelectedNewsItem,
  ])
  const isStarredSuccess =
    addToStarEvent.isSuccess &&
    addToStarEvent.variables?.eventId === selectedNewsItem?.id
  return (
    <div className="news-summary">
      <div className="news-summary_header">
        <h6>Summary</h6>
        <div className="news-summary_header">
          <a
            href={selectedNewsItem?.source_link}
            target="_blank"
            rel="noreferrer"
            className="body-small fw-600 link-to-main-article"
          >
            Read full article
          </a>
          <div className="vertical-divider" />
          <Button
            variant="white"
            className="hide-summary-btn body-small fw-600"
            onClick={() => setSelectedNewsItem(null)}
          >
            Hide summary
          </Button>
        </div>
      </div>
      <div>
        <div className="news-summary_content_header">
          <div className="header__left">
            <img
              src={selectedNewsItem?.account_logo}
              width="32"
              height="16"
              className="avatar"
              alt="company logo"
            />
            <p className="body-small">{selectedNewsItem?.account_name}</p>
            {/* <div className="header_left-divider" />
            <p className="published-date body-small">
              {dayjs(selectedNewsItem?.date_published).format('LLL')}
            </p> */}
          </div>
          <Group spacing={0}>
            <ActionIcon
              size={36}
              variant="transparent"
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation()
                addToStarEvent.mutate({
                  eventId: selectedNewsItem?.id!,
                  type: 'add',
                })
              }}
              className={isStarredSuccess ? 'news-item_star' : ''}
            >
              <img
                src={isStarredSuccess ? starFilledIcon : starIcon}
                alt="star this news"
                width="20"
                height="20"
              />
            </ActionIcon>
            <ActionIcon size={36} variant="transparent">
              <img
                src={shareIcon}
                alt="star this news"
                width="20"
                height="20"
              />
            </ActionIcon>
          </Group>
        </div>
        <div className="news-summary_content">
          <p className="body bold">{selectedNewsItem?.title}</p>
          <p className="body-small">{selectedNewsItem?.body}</p>
          <div className="content__footer">
            <Group spacing={0}>
              <p className="body-small bold">{`Event: `}</p>
              <p className="body-extra-small event-type">
                {selectedNewsItem?.event_type}
              </p>
            </Group>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsSummary
