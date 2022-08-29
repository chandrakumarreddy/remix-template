import { ActionIcon, Button, Checkbox } from '@mantine/core'
import { useFetcher } from '@remix-run/react'

import NoAccountsAddedPng from '~/assets/images/account/no-added-account.png'
import NoAccountsAddedWebp from '~/assets/images/account/no-added-account.webp'
import crossIcon from '~/assets/images/icons/cross.svg'
import MultiSelectDropDown from '~/components/multi-select-dropdown'
import { useGetAccounts, useGetPopularAccounts } from '~/hooks/accounts'
import useAccountsStore from '~/store/accounts'
import { IDetailsProps, TAccount } from '~/types/account'

const AccountDetails = ({ handleClose, setActive }: IDetailsProps) => {
  const { data } = useGetPopularAccounts()
  const { data: searchAccounts } = useGetAccounts()
  const _data = (searchAccounts ? searchAccounts : data)?.map((item) => ({
    label: item.name,
    value: item.id,
  }))
  const fetcher = useFetcher()
  const isSubmitting = fetcher.state === 'submitting'
  const [newAccountData, setNewAccountData, setAccountsSearch] =
    useAccountsStore((store) => [
      store.newAccountData,
      store.setNewAccountData,
      store.setAccountsSearch,
    ])
  const handleGlobalAccount = (_account: TAccount) => {
    const accounts = newAccountData.accounts
    const index = accounts.findIndex(
      (account) => account.value === _account.value
    )
    setNewAccountData({
      accounts: [
        ...accounts.slice(0, index),
        {
          ...accounts[index],
          isGlobal: !accounts[index].isGlobal,
        },
        ...accounts.slice(index + 1),
      ],
    })
  }
  const createUser = () => {
    newAccountData.global_accounts = newAccountData.accounts.filter(
      (item) => item.isGlobal
    )
    newAccountData.accounts = newAccountData.accounts.filter(
      (item) => !item.isGlobal
    )
    const data = {
      ...newAccountData,
      global_accounts: newAccountData.global_accounts.map(
        (item) => +item.value
      ),
      accounts: newAccountData.accounts.map((item) => +item.value),
    }
    fetcher.submit(
      {
        data: JSON.stringify(data),
        _method: 'create_user',
      },
      {
        method: 'post',
        action: '/a/dashboard',
      }
    )
  }
  return (
    <div className="account-details">
      <MultiSelectDropDown
        label=""
        id="add account"
        type="search"
        placeholder="Add account"
        data={_data ?? []}
        onSearch={(val) => setAccountsSearch(val)}
        onChange={(value) => {
          setNewAccountData({
            accounts: value.map((account) => ({
              ...account,
              isGlobal:
                newAccountData.accounts.find(
                  (item) => item.label === account.label
                )?.isGlobal ?? false,
            })),
          })
        }}
        RenderChildren={({ handleItemClick }) => {
          if (!newAccountData.accounts.length) return null
          return (
            <div className="accounts-assigned-container">
              <p className="body bold">Accounts assigned by admin</p>
              <div className="accounts-assigned">
                {newAccountData.accounts.map((account) => (
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
      {newAccountData.accounts.length ? null : (
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
            Add accounts for which you want the salesperson to receive news and
            opportunities
          </p>
        </div>
      )}
      <div className="account-details-footer">
        <Button
          variant="outline"
          className="body-small fw-600 cancel"
          onClick={() => setActive((s) => s - 1)}
        >
          Back
        </Button>
        <div>
          <Button
            variant="outline"
            className="body-small fw-600 cancel"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="body fw-600 next"
            onClick={createUser}
            type="button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending' : 'Send Invite'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AccountDetails
