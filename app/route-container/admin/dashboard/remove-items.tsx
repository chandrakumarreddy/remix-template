import { Button } from '@mantine/core'

import useAccountsStore from '~/store/accounts'

const RemoveItems = () => {
  const [accountsSelected, setAllAccountsSelected] = useAccountsStore(
    (store) => [store.accountsSelected, store.setAllAccountsSelected]
  )
  if (!accountsSelected.length) return null
  return (
    <div className="admin-dashboard__remove-accounts">
      <div className="admin-dashboard__remove-accounts-left">
        <p className="body-small fw-600 admin-dashboard__remove-items-title">{`${accountsSelected.length} selected`}</p>
        <Button className="admin-dashboard__remove-accounts-left_remove-btn body-small fw-600">
          Remove salesperson
        </Button>
      </div>
      <Button
        className="admin-dashboard__remove-accounts-left_deselect-btn body-small fw-600"
        onClick={() => setAllAccountsSelected([], false)}
      >
        Deselect
      </Button>
    </div>
  )
}

export default RemoveItems
