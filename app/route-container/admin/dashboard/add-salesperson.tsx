import { Button, Drawer, Stepper } from '@mantine/core'
import { useState } from 'react'

import { NEW_ACCOUNT_INITIAL_STATE } from '~/constants/accounts'
import useAccountsStore from '~/store/accounts'

import AccountDetails from './account-details'
import BasicDetails from './basic-details'

const AddSalesPerson = () => {
  const [active, setActive] = useState(0)
  const [opened, setOpened] = useState(false)
  const setNewAccountData = useAccountsStore((store) => store.setNewAccountData)
  const handleClose = () => {
    setOpened(false)
    setActive(0)
    setNewAccountData(NEW_ACCOUNT_INITIAL_STATE)
  }
  return (
    <>
      <Button className="add-btn body bold" onClick={() => setOpened(true)}>
        + Add salesperson
      </Button>
      <Drawer
        opened={opened}
        onClose={handleClose}
        title="Add salesperson"
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
        <Stepper
          active={active}
          onStepClick={active > 0 ? setActive : () => {}}
          classNames={{
            stepLabel: 'body-small fw-600 step-label',
            stepIcon: 'step-icon body-small fw-600',
            steps: 'steps-container',
            stepProgress: 'step-progress',
            stepCompleted: 'step-completed',
            separatorActive: 'seperator-active',
            root: 'stepper-root',
            content: 'stepper-content',
          }}
        >
          <Stepper.Step label={'Basic details'}>
            <BasicDetails setActive={setActive} handleClose={handleClose} />
          </Stepper.Step>
          <Stepper.Step label="Second step">
            <AccountDetails setActive={setActive} handleClose={handleClose} />
          </Stepper.Step>
        </Stepper>
      </Drawer>
    </>
  )
}
export default AddSalesPerson
