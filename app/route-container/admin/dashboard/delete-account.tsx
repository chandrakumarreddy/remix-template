import { Button } from '@mantine/core'
import { useFetcher } from '@remix-run/react'

import CustomModal from '~/components/custom-modal'
import useAccountsStore from '~/store/accounts'

const DeleteAccount = () => {
  const fetcher = useFetcher()
  const [deleteAccount, setDeleteAccount] = useAccountsStore((store) => [
    store.deleteAccount,
    store.setDeleteAccount,
  ])
  return (
    <CustomModal
      centered
      title=""
      overlayOpacity={0.5}
      opened={!!deleteAccount}
      onClose={() => setDeleteAccount(null)}
      classNames={{
        root: 'delete-modal-root',
        header: 'delete-modal-header',
        body: 'delete-account-modal-body',
      }}
    >
      <h4 className="text-color">{`Delete the salesperson '${deleteAccount?.name}'?`}</h4>
      <p className="body text-color">This will remove their access to orbitX</p>
      <div className="delete-account-actions">
        <Button
          className="body-small fw-600 cancel"
          variant="outline"
          onClick={() => setDeleteAccount(null)}
        >
          Cancel
        </Button>
        <fetcher.Form method="delete" action="/a/dashboard/">
          <input type="hidden" name="_method" value="delete_user" />
          <input type="hidden" name="user_id" value={deleteAccount?.id} />
          <Button className="body-small fw-600 delete" type="submit">
            Delete
          </Button>
        </fetcher.Form>
      </div>
    </CustomModal>
  )
}

export default DeleteAccount
