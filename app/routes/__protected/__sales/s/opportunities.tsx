import { Button, Group, Loader, Tabs } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useLoaderData } from '@remix-run/react'
import { MouseEvent, useEffect } from 'react'
import { useState } from 'react'

import linkedinIcon from '~/assets/images/icons/linkedin-1.png'
import pinIcon from '~/assets/images/icons/pin.png'
import SearchIcon from '~/assets/images/icons/search.svg'
import starIcon from '~/assets/images/icons/star.png'
import starFilledIcon from '~/assets/images/icons/star-filled.png'
import Header from '~/components/default-header'
import InputComponent from '~/components/input-component'
import URLS from '~/config/urls'
import {
  useAddToStarOpportunity,
  useGetOpportunities,
  useGetOpportunityPeoples,
} from '~/hooks/opportunities'
import useSkipFirstRender from '~/hooks/useSkipFirstRender'
import type { LinksFunction, LoaderFunction } from '~/remix.server'
import Options from '~/route-container/dashboard/options'
import { getDecodeTokenData } from '~/session.server'
import useSalesOpportunities from '~/store/sales/opportunities'
import styles from '~/styles/dashboard/opportunities.css'
import { IOpportunity, IOpportunityAccount } from '~/types/opportunities'
import fetchHandler from '~/utils/server/fetchHandler.server'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export const loader: LoaderFunction = async ({ request }) => {
  const data = await getDecodeTokenData(request)
  const response = await fetchHandler(
    request,
    `${URLS.V1}/tenants/${data?.tenant_id}/users/${data?.user_id}/accounts/opportunities`
  )
  return (response.data.accounts as IOpportunityAccount[]).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
}
export default function Opportunities() {
  const [activeOpportunity, resetOps] = useSalesOpportunities((store) => [
    store.activeOpportunity,
    store.resetOps,
  ])
  useEffect(() => {
    return () => {
      resetOps()
    }
  }, [])
  return (
    <div id="d-o-page">
      <Header children={<Options />} />
      <div className={`d-o-page-content${activeOpportunity ? ' ops' : ''}`}>
        <RenderAccounts />
        <RenderTabs />
        <div className="d-o-page_divider" />
        <RenderOpportunityInDetail />
      </div>
    </div>
  )
}

const RenderAccounts = () => {
  const accounts = useLoaderData<IOpportunityAccount[]>()
  const [search, setSearch] = useState('')
  const setActive = useSalesOpportunities((store) => store.setActiveAccount)
  useState(() => setActive(accounts[0]))
  const active = useSalesOpportunities((store) => store.activeAccount)
  const [_search] = useDebouncedValue<string>(search, 200)
  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(_search.toLowerCase())
  )
  return (
    <div className="d-o-page-accounts">
      <InputComponent
        id="search"
        placeholder="Search"
        inputClassNames={{
          input: 'input body-small accounts-search',
        }}
        type="text"
        icon={
          <img
            src={SearchIcon}
            width="20"
            height="20"
            alt="click here to search"
          />
        }
        value={search}
        onChange={(value: string) => setSearch(value)}
      />
      <div>
        {filteredAccounts.map((item) => {
          const isActive = item.id === active?.id
          return (
            <Button
              className={`d-o-page-account${isActive ? ' active' : ''}`}
              key={item.id}
              variant="outline"
              onClick={() => {
                if (item.id !== active?.id) {
                  setActive(item)
                  setSearch('')
                }
              }}
            >
              <p
                className={`body fw-600${
                  isActive ? ' text-black' : ' text-darkest'
                }`}
              >
                {item.short_name}
              </p>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

const RenderTabs = () => {
  const [active, setActiveOpportunity] = useSalesOpportunities((store) => [
    store.activeAccount,
    store.setActiveOpportunity,
  ])
  useEffect(() => {
    return () => {
      setActiveOpportunity(null)
      document.querySelector('.scroll-area-ops-tabs')?.scroll(0, 0)
    }
  }, [active?.short_name])
  const [activeTab, setActiveTab] = useState(0)
  return (
    <div className="d-o-page-ops_wrapper">
      <Group position="apart" align="center" className="d-o-page-ops__header">
        <h6 className="d-o-page-ops_title">{`Opportunities at ${active?.short_name}`}</h6>
        <SearchOpportunities />
      </Group>
      <div className="d-o-page-ops">
        <Tabs
          active={activeTab}
          onTabChange={setActiveTab}
          classNames={{
            tabsListWrapper: 'd-o-page-ops_tabListWrapper',
            root: 'd-o-page-ops_tabsRoot',
            tabsList: 'd-o-page-ops_tabsList',
            tabLabel: 'body-small text-light d-o-page-ops_tabsLabel',
            tabControl: 'd-o-page-ops_tabControl',
            tabActive: 'd-o-page-ops_tabActive',
            body: 'd-o-page-ops_tabsbody',
          }}
        >
          <Tabs.Tab label="All">
            <GetOpportunities active={active} type="all" />
          </Tabs.Tab>
          <Tabs.Tab label="Starred">
            <GetOpportunities active={active} type="starred" />
          </Tabs.Tab>
        </Tabs>
      </div>
    </div>
  )
}

const SearchOpportunities = () => {
  const [value, setValue] = useState('')
  const [setSearchOps, activeAccount] = useSalesOpportunities((store) => [
    store.setSearchOps,
    store.activeAccount,
  ])
  const [_value, cancel] = useDebouncedValue(value, 300)
  useEffect(() => {
    setSearchOps(_value)
  }, [_value])
  useEffect(() => {
    return () => {
      setValue('')
      cancel()
    }
  }, [activeAccount?.id])
  return (
    <InputComponent
      id="search"
      placeholder="Search opportunities"
      wrapperClassNames={{
        root: 'search-ops',
      }}
      inputClassNames={{
        input: 'input body-small ops-search',
      }}
      type="text"
      icon={
        <img
          src={SearchIcon}
          width="20"
          height="20"
          alt="click here to search"
        />
      }
      value={value}
      onChange={setValue}
    />
  )
}

const RenderOpportunityInDetail = () => {
  const activeOpportunity = useSalesOpportunities(
    (store) => store.activeOpportunity
  )
  useEffect(() => {
    document.querySelector('.scroll-area-ops-detail')?.scroll(0, 0)
  }, [activeOpportunity?.id])
  return !activeOpportunity ? null : <OpportunityDetail />
}

const OpportunityDetail = () => {
  const activeId = useSalesOpportunities((store) => store.activeAccount?.id)
  const [activeOpportunity, setActiveOpportunity] = useSalesOpportunities(
    (store) => [store.activeOpportunity, store.setActiveOpportunity]
  )
  const { data, isLoading } = useGetOpportunityPeoples(
    activeOpportunity?.id!,
    `${activeOpportunity?.id}-${activeOpportunity?.name!}`
  )
  return (
    <div className="d-o-page-ops_detail scroll-area-ops-detail">
      <Group spacing={0} position="apart" align="flex-start">
        <p className="body fw-600 d-o-page-ops_detail-title">
          {activeOpportunity?.name}
        </p>
        <div className="d-o-page-ops_detail-hright">
          <StarItem
            item={activeOpportunity!}
            accountId={activeId}
            setActiveOpportunity={setActiveOpportunity}
          />
          <div className="d-o-page-ops_detail-hright_divider" />
          <Button
            variant="white"
            className="d-o-page-ops_detail-hidebtn"
            onClick={() => setActiveOpportunity(null)}
          >
            Hide details
          </Button>
        </div>
      </Group>
      <div className="d-o-page-ops_detail-content">
        <p className="body-small bold">Opportunity description</p>
        <p className="body-small">{activeOpportunity?.description}</p>
      </div>
      <p className="body-small">
        <span className="bold">Typical IT spend (TCV): </span>$
        {activeOpportunity?.typical_it_spend} million
      </p>
      {isLoading ? (
        <div className="d-o-page-ops_detail-loader">
          <Loader size="lg" color="#6c5ce7" />
        </div>
      ) : (
        <>
          <div>
            <div className="d-o-page-ops_detail-bsm">
              <p className="body-small bold">Business decision makers</p>
              <div className="d-o-page-ops_detail-items">
                {data?.stakeholders_business?.map((item) => (
                  <div key={item.name} className="d-o-page-ops_detail-item">
                    <p className="body-small bold">{item.name}</p>
                    <p className="body-small">{item.job_title}</p>
                    <div className="flex-item">
                      <img
                        src={pinIcon}
                        alt="location"
                        width="16"
                        height="16"
                      />
                      <p className="body-small">{item.location}</p>
                    </div>
                    <div className="flex-item">
                      <img
                        src={linkedinIcon}
                        alt="location"
                        width="16"
                        height="16"
                      />
                      <a
                        href={`https://${item.linkedin_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="external-link body-extra-small"
                      >
                        Visit linkedin profile
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="d-o-page-ops_detail-bsm">
              <p className="body-small bold">IT decision makers</p>
              <div className="d-o-page-ops_detail-items">
                {data?.stakeholders_it?.map((item) => (
                  <div key={item.name} className="d-o-page-ops_detail-item">
                    <p className="body-small bold">{item.name}</p>
                    <p className="body-small">{item.job_title}</p>
                    <div className="flex-item">
                      <img
                        src={pinIcon}
                        alt="location"
                        width="16"
                        height="16"
                      />
                      <p className="body-small">{item.location}</p>
                    </div>
                    <div className="flex-item">
                      <img
                        src={linkedinIcon}
                        alt="location"
                        width="16"
                        height="16"
                      />
                      <a
                        href={`https://${item.linkedin_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="external-link body-extra-small"
                      >
                        Visit linkedin profile
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const GetOpportunities = ({
  active,
  type,
}: {
  active: IOpportunityAccount | null
  type: 'all' | 'starred'
}) => {
  const { data, isLoading } = useGetOpportunities(type)
  return isLoading ? (
    <div className="ops_loader">
      <Loader size={64} color="#6c5ce7" />
    </div>
  ) : data?.length ? (
    <RenderOpportunities data={data} active={active} />
  ) : (
    <div className="no-results-found">
      <h3>No Results found</h3>
    </div>
  )
}

const RenderOpportunities = ({
  data,
  active,
}: {
  data: IOpportunity[]
  active: IOpportunityAccount | null
}) => {
  const searchOps = useSalesOpportunities((store) => store.searchOps)
  const [activeOpportunity, setActiveOpportunity] = useSalesOpportunities(
    (store) => [store.activeOpportunity, store.setActiveOpportunity]
  )
  const _filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchOps.toLowerCase())
  )
  return (
    <>
      {_filteredData.map((item) => (
        <div key={item.id}>
          <div
            className={`d-o-page-ops_tabsbody-item${
              item.id === activeOpportunity?.id ? ' active' : ''
            }`}
            role="button"
            tabIndex={0}
            onClick={() => setActiveOpportunity(item)}
          >
            <div>
              <p className="body-small fw-600">{item.name}</p>
              <p className="body-small">{item.description}</p>
            </div>
            <Group spacing={0} position="apart">
              <Group spacing={0}>
                <p className="body-extra-small fw-600">
                  Typical IT spend (TCV): &nbsp;
                </p>
                <p className="body-extra-small fw-600">
                  ${`${item.typical_it_spend} million`}
                </p>
              </Group>
              <StarItem item={item} accountId={active?.id} />
            </Group>
          </div>
          <div className="ops_divider" />
        </div>
      ))}
    </>
  )
}

const StarItem = ({
  item,
  accountId,
  setActiveOpportunity,
}: {
  item: IOpportunity
  accountId: number | undefined
  setActiveOpportunity?: (val: IOpportunity) => void
}) => {
  const [isStarred, setIsStarred] = useState(() => item.is_starred)
  const addToStarOpportunity = useAddToStarOpportunity()
  useSkipFirstRender(() => {
    const isStarredSuccess =
      addToStarOpportunity.isSuccess &&
      addToStarOpportunity.variables?.accountId === accountId &&
      addToStarOpportunity.variables?.opsId === item.id &&
      addToStarOpportunity.variables.type === 'add'
    setIsStarred(isStarredSuccess)
    setActiveOpportunity?.({ ...item, is_starred: isStarredSuccess })
  }, [addToStarOpportunity.isSuccess])
  useSkipFirstRender(() => {
    setIsStarred(item.is_starred)
  }, [item.is_starred])
  return (
    <button
      className={`bookmark ${isStarred ? 'news-item_star' : ''}`}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        addToStarOpportunity.mutate({
          accountId: accountId!,
          opsId: item.id,
          type: isStarred ? 'remove' : 'add',
        })
      }}
    >
      <img
        src={isStarred ? starFilledIcon : starIcon}
        alt="star this news"
        width="20"
        height="20"
      />
    </button>
  )
}
