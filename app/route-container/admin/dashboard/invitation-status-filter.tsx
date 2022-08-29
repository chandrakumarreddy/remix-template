import { useEffect } from 'react'

import useAccountsStore from '~/store/accounts'

export default function InvitationStatusFilter({ column }) {
  const { setFilter } = column
  const activated = useAccountsStore((store) => store.filters.activated)

  useEffect(() => {
    setFilter(activated)
  }, [activated])
  return null
}
