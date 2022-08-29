import {
  ActionIcon,
  Button,
  Checkbox,
  Drawer,
  Select,
  SimpleGrid,
  Tabs,
} from '@mantine/core'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'

import NoAccountsAddedPng from '~/assets/images/account/no-added-account.png'
import NoAccountsAddedWebp from '~/assets/images/account/no-added-account.webp'
import caretDownIcon from '~/assets/images/icons/carat-down.svg'
import crossIcon from '~/assets/images/icons/cross.svg'
import InputComponent from '~/components/input-component'
import MultiSelectDropDown from '~/components/multi-select-dropdown'
import {
  useGetAccounts,
  useGetCountries,
  useGetPopularAccounts,
} from '~/hooks/accounts'
import useSkipFirstRender from '~/hooks/useSkipFirstRender'
import useAccountsStore from '~/store/accounts'
import { TAccount } from '~/types/account'

const EditAccount = () => {
  const fetcher = useFetcher()
  const { data: countries } = useGetCountries()
  const { data } = useGetPopularAccounts()
  const { data: searchAccounts } = useGetAccounts()
  const _countries = countries?.map((country) => ({
    label: country,
    value: country,
  }))
  const _dataAccounts = (searchAccounts ? searchAccounts : data)?.map(
    (item) => ({
      label: item.name,
      value: item.id.toString(),
    })
  )
  const [editAccountData, setEditAccountData, setAccountsSearch] =
    useAccountsStore((store) => [
      store.editAccountData,
      store.setEditAccountData,
      store.setAccountsSearch,
    ])
  const [activeTab, setActiveTab] = useState(0)
  useSkipFirstRender(() => {
    if (fetcher.data?.success) {
      setEditAccountData(null)
    }
  }, [fetcher.data])
  const handleClose = () => {
    setEditAccountData(null)
  }
  const handleGlobalAccount = (_account: TAccount) => {
    const accounts = editAccountData?._accounts
    if (accounts) {
      const index = accounts?.findIndex(
        (account) => account.value === _account.value
      )
      setEditAccountData({
        _accounts: [
          ...accounts.slice(0, index),
          {
            ...accounts[index],
            isGlobal: !accounts[index].isGlobal,
          },
          ...accounts.slice(index + 1),
        ],
      })
    }
  }
  const updateUser = () => {
    const { fname, sname, country, _accounts } = editAccountData ?? {}
    const accounts = _accounts?.reduce<number[]>(
      (acc, cur) => (!cur.isGlobal ? [...acc, +cur.value] : acc),
      []
    )
    const global_accounts = _accounts?.reduce<number[]>(
      (acc, cur) => (cur.isGlobal ? [...acc, +cur.value] : acc),
      []
    )
    fetcher.submit(
      {
        id: editAccountData?.id!,
        data: JSON.stringify({
          fname,
          sname,
          country,
          accounts,
          global_accounts,
        }),
        _method: 'update_user',
      },
      { method: 'put' }
    )
  }
  return (
    <Drawer
      opened={!!editAccountData}
      onClose={() => setEditAccountData(null)}
      title={`${editAccountData?.fname} ${editAccountData?.sname}`}
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
      <Tabs
        active={activeTab}
        onTabChange={setActiveTab}
        classNames={{
          tabLabel: 'edit-label body-small fw-600',
          root: 'edit-tabs',
          tabActive: 'edit-tab-active',
          tabControl: 'edit-tab-control',
          tabsListWrapper: 'edit-tablist-wrapper',
          body: 'edit-tab-body',
        }}
      >
        <Tabs.Tab label="Basic details">
          <SimpleGrid cols={2} spacing={24}>
            <InputComponent
              label="First Name"
              id="first-name"
              placeholder="Enter the first name"
              value={editAccountData?.fname || ''}
              onChange={(value) => setEditAccountData({ fname: value })}
            />
            <InputComponent
              label="Last Name"
              id="last-name"
              placeholder="Enter the last name"
              value={editAccountData?.sname || ''}
              onChange={(value) => setEditAccountData({ sname: value })}
            />
          </SimpleGrid>
          <InputComponent
            disabled
            label="Email"
            id="email-id"
            type="email"
            placeholder="Official email address"
            value={editAccountData?.email || ''}
            onChange={(value) => setEditAccountData({ email: value })}
          />
          <Select
            autoComplete="none"
            searchable
            label="Region"
            placeholder="Region"
            data={_countries ?? []}
            value={editAccountData?.country || ''}
            rightSection={<img src={caretDownIcon} alt="show more options" />}
            classNames={{
              label: 'body-small',
              input: 'input body',
              item: 'select-item body-small',
              selected: 'select-item-selected',
            }}
            onChange={(value) => setEditAccountData({ country: value || '' })}
          />
        </Tabs.Tab>
        <Tabs.Tab label="Account details">
          <MultiSelectDropDown
            label=""
            id="add account"
            type="search"
            placeholder="Add account"
            data={_dataAccounts ?? []}
            defaultItems={editAccountData?._accounts}
            onSearch={(val) => setAccountsSearch(val)}
            onChange={(value) => {
              setEditAccountData({
                _accounts: value.map((account) => ({
                  ...account,
                  isGlobal:
                    editAccountData?._accounts?.find(
                      (item) => item.label === account.label
                    )?.isGlobal ?? false,
                })),
              })
            }}
            RenderChildren={({ handleItemClick }) => {
              if (!editAccountData?._accounts?.length) return null
              return (
                <div className="accounts-assigned-container">
                  <p className="body bold">Accounts assigned by admin</p>
                  <div className="accounts-assigned">
                    {editAccountData._accounts.map((account) => (
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
          {editAccountData?._accounts?.length ? null : (
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
        </Tabs.Tab>
      </Tabs>
      <div className="edit-details-footer">
        <Button
          variant="outline"
          className="body-small fw-600 cancel"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button className="body fw-600 next" type="button" onClick={updateUser}>
          Confirm Changes
        </Button>
      </div>
    </Drawer>
  )
}

export default EditAccount
