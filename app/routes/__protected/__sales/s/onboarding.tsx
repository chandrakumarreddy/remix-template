import {
  ActionIcon,
  Button,
  Checkbox,
  Drawer,
  Select,
  SimpleGrid,
} from '@mantine/core'
import { useFetcher } from '@remix-run/react'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import NoAccountsAddedPng from '~/assets/images/account/no-added-account.png'
import NoAccountsAddedWebp from '~/assets/images/account/no-added-account.webp'
import recommendationsPng from '~/assets/images/account/recommendations.png'
import caretDownIcon from '~/assets/images/icons/carat-down.svg'
import crossIcon from '~/assets/images/icons/cross.svg'
import FlashIcon from '~/assets/images/icons/flash.svg'
import InputComponent from '~/components/input-component'
import MultiSelectDropDown, {
  multiSelectStyles,
  TData,
} from '~/components/multi-select-dropdown'
import URLS from '~/config/urls'
import {
  useGetAccounts,
  useGetCountries,
  useGetPopularAccounts,
} from '~/hooks/accounts'
import useParentData from '~/hooks/useParentData'
import type { ActionFunction, LinksFunction, LoaderArgs } from '~/remix.server'
import { redirect } from '~/remix.server'
import { commitCookieSession, getSession } from '~/session.server'
import useAccountsStore from '~/store/accounts'
import useSalesOnBoardingStore from '~/store/sales/onboarding'
import styles from '~/styles/dashboard/onboarding.css'
import { IUserAccount, TAccount } from '~/types/account'
import { IRootData } from '~/types/root'
import fetchHandler from '~/utils/server/fetchHandler.server'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }, ...multiSelectStyles]
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request)
  const formData = await request.formData()
  const _method = formData.get('_method')
  switch (_method) {
    case 'update_user':
      await fetchHandler(
        request,
        `${URLS.V1}/tenants/${session.get('tenant_id')}/users/${+formData.get(
          'user_id'
        )!}`,
        {
          method: 'put',
          body: JSON.stringify({
            user: JSON.parse(formData.get('data') as string),
          }),
        }
      )
      await fetchHandler(
        request,
        `${URLS.V1}/tenants/${session.get('tenant_id')}/users/${+formData.get(
          'user_id'
        )!}`,
        {
          method: 'put',
          body: JSON.stringify({
            user: { onboarded: true },
          }),
        }
      )
      session.unset('onboarding')
      return redirect('/s/news/', {
        headers: {
          'Set-Cookie': await commitCookieSession(session),
        },
      })
    default:
      return null
  }
}

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request)
  if (!session.get('onboarded')) {
    return redirect('/s/news/')
  }
  return null
}

export default function Onboarding() {
  const user = useParentData<IUserAccount>('', 'root')
  const { data } = useGetPopularAccounts()
  const { data: accounts } = useGetAccounts()
  const _data = (accounts ? accounts : data)?.map((item) => ({
    label: item.name,
    value: item.id.toString(),
  }))
  const setAccountsSearch = useAccountsStore((store) => store.setAccountsSearch)
  const [accountsSelected, setAccountsSelected] = useSalesOnBoardingStore(
    (store) => [store.accountsSelected, store.setAccountsSelected]
  )
  useState(() =>
    user
      ? setAccountsSelected([
          ...user.accounts.map((item) => ({
            label: item.name,
            value: item.id,
            isGlobal: false,
          })),
          ...user.global_accounts.map((item) => ({
            label: item.name,
            value: item.id,
            isGlobal: true,
          })),
        ])
      : null
  )
  const handleGlobalAccount = (_account: TAccount) => {
    const index = accountsSelected.findIndex(
      (account) => account.value === _account.value
    )
    setAccountsSelected([
      ...accountsSelected.slice(0, index),
      {
        ...accountsSelected[index],
        isGlobal: !accountsSelected[index].isGlobal,
      },
      ...accountsSelected.slice(index + 1),
    ])
  }
  return (
    <div id="sales-onboarding">
      <h3 className="sales-onboarding__title">You’re almost there</h3>
      <div className="sales-onboarding-wrapper">
        <div className="sales-onboarding__left-section">
          <p className="body sales-onboarding__left-section-title">
            You will see relevant news, opportunies and key people associated
            with these opportunities for your accounts
          </p>
          <MultiSelectDropDown
            label=""
            id="add account"
            type="search"
            placeholder="Add account"
            data={_data ?? []}
            onSearch={(val) => setAccountsSearch(val)}
            onChange={(value) => {
              setAccountsSelected(
                value.map((account) => ({
                  ...account,
                  isGlobal:
                    accountsSelected.find(
                      (item) => item.label === account.label
                    )?.isGlobal ?? false,
                }))
              )
            }}
            RenderChildren={({ handleItemClick }) => {
              if (!accountsSelected.length) return null
              return (
                <div className="accounts-assigned-container">
                  <p className="body bold">Accounts assigned by admin</p>
                  <div className="accounts-assigned">
                    {accountsSelected.map((account) => (
                      <div key={account.label} className="account-assigned">
                        <p className="body-small">{account.label}</p>
                        <div className="account-assigned__addglobal">
                          <Checkbox
                            label="Global account"
                            className="addtoglobal-checkbox"
                            checked={account.isGlobal}
                            onChange={() => handleGlobalAccount(account)}
                          />
                          <ActionIcon
                            size={32}
                            onClick={() => {
                              handleItemClick(account)
                            }}
                            variant="transparent"
                          >
                            <img
                              src={crossIcon}
                              width="20"
                              height="20"
                              alt="remove account"
                            />
                          </ActionIcon>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }}
          />
          {accountsSelected.length ? null : (
            <div className="no-accounts-found">
              <picture>
                <source srcSet={NoAccountsAddedWebp} type="image/webp" />
                <img
                  src={NoAccountsAddedPng}
                  width="250"
                  height="240"
                  alt="no accounts are added"
                />
              </picture>
              <p className="body">
                Add accounts for which you want the salesperson to receive news
                and opportunities
              </p>
            </div>
          )}
        </div>
        <RightSection />
      </div>
      <Proceed />
    </div>
  )
}

const RightSection = () => {
  const [opened, setOpened] = useState(false)
  return (
    <>
      <div className="sales-onboarding__right-section">
        <img
          src={recommendationsPng}
          alt="no recommendations found"
          width="340"
          height="350"
        />
        <Button
          className="get-recommendations-btn"
          variant="white"
          rightIcon={
            <img src={FlashIcon} width="20px" height="20px" alt="flash icon" />
          }
          onClick={() => setOpened(true)}
        >
          Get account recommendations
        </Button>
      </div>
      <ChooseRecommendationPrefences opened={opened} setOpened={setOpened} />
    </>
  )
}

interface ICRProps {
  opened: boolean
  setOpened: Dispatch<SetStateAction<boolean>>
}
const ChooseRecommendationPrefences = ({ opened, setOpened }: ICRProps) => {
  const { data: countries } = useGetCountries()
  const _countries = countries?.map((country) => ({
    label: country,
    value: country,
  }))
  const [region, setRegion] = useState('')
  const [industries, setIndustries] = useState<TData[]>([])
  const [minRevenue, setMinRevenue] = useState('0')
  const [maxRevenue, setMaxRevenue] = useState('0')
  return (
    <Drawer
      opened={opened}
      onClose={() => setOpened(false)}
      title="Select recommendation preferences"
      padding="xl"
      size="708px"
      position="right"
      lockScroll
      overlayOpacity={0.5}
      withinPortal
      shadow="0px 0px 1px rgba(15, 23, 42, 0.06), 0px 10px 15px -3px rgba(15, 23, 42, 0.1), 0px 4px 6px -2px rgba(15, 23, 42, 0.05)"
      classNames={{
        title: 'drawer-title',
        drawer: 'drawer-root-paper',
      }}
    >
      <div className="drawer-content">
        <Select
          searchable
          autoComplete="none"
          aria-autocomplete="none"
          label="Region"
          placeholder="Region"
          data={_countries ?? []}
          rightSection={<img src={caretDownIcon} alt="show more options" />}
          classNames={{
            label: 'body-small',
            input: 'input body',
            item: 'select-item body-small',
            selected: 'select-item-selected',
          }}
          value={region}
          onChange={(value) => setRegion(value || '')}
        />
        <MultiSelectDropDown
          label="Industries"
          id="add-industries"
          type="search"
          placeholder="Industries"
          data={[
            { label: 'Andorra', value: 'Andorra' },
            { label: 'Austria', value: 'Austria' },
            { label: 'Belarus', value: 'Belarus' },
          ]}
          onChange={(value) => setIndustries(value)}
          RenderChildren={({ handleItemClick }) => {
            return industries.length ? (
              <div className="multi-select-items">
                {industries.map((item) => (
                  <Button
                    key={item.label}
                    classNames={{
                      root: 'multi-select-item body-small',
                      rightIcon: 'multi-select-item-icon',
                    }}
                    onClick={() => handleItemClick(item)}
                    rightIcon={
                      <img
                        src={crossIcon}
                        alt="deselect item"
                        width="16"
                        height="16"
                      />
                    }
                  >
                    {item.value}
                  </Button>
                ))}
              </div>
            ) : null
          }}
        />
        <SimpleGrid spacing={24} cols={2}>
          <InputComponent
            label="Minimum Revenue"
            placeholder="1000"
            id="min-revenue"
            value={minRevenue}
            onChange={(value) => setMinRevenue(value)}
          />
          <InputComponent
            label="Maximum Revenue"
            placeholder="100000"
            id="max-revenue"
            value={maxRevenue}
            onChange={(value) => setMaxRevenue(value)}
          />
        </SimpleGrid>
      </div>
      <div className="drawer-footer">
        <Button variant="outline" className="cancel-btn body bold">
          Cancel
        </Button>
        <Button variant="outline" className="save-btn body bold">
          Save preferences
        </Button>
      </div>
    </Drawer>
  )
}

const Proceed = () => {
  const fetcher = useFetcher()
  const rootData = useParentData<IRootData>('', 'root')
  const accountsSelected = useSalesOnBoardingStore(
    (store) => store.accountsSelected
  )
  const handleSubmit = () => {
    fetcher.submit(
      {
        data: JSON.stringify({
          accounts: accountsSelected.map((account) => +account.value),
        }),
        user_id: rootData?.user_id.toString() || '',
        _method: 'update_user',
      },
      {
        method: 'post',
        action: '/s/onboarding/',
      }
    )
  }
  return (
    <div className="proceed-section">
      <Button
        variant="white"
        className="proceed-section__btn body bold"
        type="button"
        onClick={handleSubmit}
      >
        Proceed
      </Button>
    </div>
  )
}
