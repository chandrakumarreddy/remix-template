import { ActionIcon, Checkbox } from '@mantine/core'
import type { ChangeEvent } from 'react'

import deleteIcon from '~/assets/images/icons/delete.svg'
import editIcon from '~/assets/images/icons/edit.svg'
import useAccountsStore from '~/store/accounts'
import { ITableHeadCheckbox, ITableRow } from '~/types/admin'

export const TableHeadCheckbox = ({ data }: ITableHeadCheckbox) => {
  const [isAllAccountsSelected, setAllAccountsSelected] = useAccountsStore(
    (store) => [store.isAllAccountsSelected, store.setAllAccountsSelected]
  )
  return (
    <Checkbox
      classNames={{
        root: 'select-row',
        input: 'select-row-checkbox',
      }}
      checked={isAllAccountsSelected}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        setAllAccountsSelected(
          event.target.checked ? data.map((item) => item.id) : [],
          event.target.checked
        )
      }
    />
  )
}

export const TableRow = ({ row }: ITableRow) => {
  const [
    setAccountsSelected,
    setAllAccountsSelected,
    accountsSelected,
    setDeleteAccount,
    setEditAccountData,
  ] = useAccountsStore((store) => [
    store.setAccountsSelected,
    store.setAllAccountsSelected,
    store.accountsSelected,
    store.setDeleteAccount,
    store.setEditAccountData,
  ])
  const isAllAccountsSelected = useAccountsStore(
    (store) => store.isAllAccountsSelected
  )
  const isSelected = accountsSelected.includes(row.original.id)
  return (
    <tr
      {...row.getRowProps()}
      className={`body-small fw-500${isSelected ? ' table-row-selected' : ''}`}
    >
      {row.cells.map((cell) => {
        const isNameHeader = cell.column.Header === 'NAME'
        const Elem = isNameHeader ? 'label' : 'p'
        return (
          <td {...cell.getCellProps()} key={cell.column.id}>
            {cell.column.Header === '' ? (
              <div className="row-flex edit-delete-account">
                <ActionIcon
                  size={36}
                  onClick={() =>
                    setEditAccountData({
                      ...row.original,
                      _accounts: [
                        ...row.original.accounts.map((item) => ({
                          label: item.name,
                          value: item.id,
                          isGlobal: false,
                        })),
                        ...row.original.global_accounts.map((item) => ({
                          label: item.name,
                          value: item.id,
                          isGlobal: true,
                        })),
                      ],
                    })
                  }
                >
                  <img
                    src={editIcon}
                    alt="edit profile"
                    width="20"
                    height="20"
                  />
                </ActionIcon>
                <ActionIcon
                  size={36}
                  className="delete-account"
                  onClick={() => setDeleteAccount(row.original)}
                >
                  <img
                    src={deleteIcon}
                    alt="edit profile"
                    width="20"
                    height="20"
                  />
                </ActionIcon>
              </div>
            ) : (
              <div className="row-flex">
                {isNameHeader && (
                  <Checkbox
                    classNames={{
                      root: 'select-row',
                      input: 'select-row-checkbox',
                    }}
                    id={row.original.id}
                    checked={isSelected}
                    onChange={() => {
                      setAccountsSelected(row.original.id)
                      if (isAllAccountsSelected) {
                        setAllAccountsSelected(
                          accountsSelected.filter(
                            (account) => account !== row.original.id
                          ),
                          false
                        )
                      }
                    }}
                  />
                )}
                <Elem
                  htmlFor={isNameHeader ? row.original.id : ''}
                  className={`body-small${
                    cell.column.id === 'activated'
                      ? ` cell-value ${row.original.statusClass}`
                      : ''
                  } `}
                >
                  {cell.render('Cell')}
                </Elem>
              </div>
            )}
          </td>
        )
      })}
    </tr>
  )
}
