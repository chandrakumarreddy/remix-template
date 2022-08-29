import type { ModalProps } from '@mantine/core'
import { Modal } from '@mantine/core'
import { useScrollLock } from '@mantine/hooks'
import { useEffect } from 'react'

export default function CustomModal(props: ModalProps): JSX.Element {
  const { opened, ...rest } = props
  const setScrollLocked = useScrollLock()[1]
  useEffect(() => {
    setScrollLocked(opened)
    return () => {
      setScrollLocked(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened])
  return (
    <Modal
      opened={opened}
      withinPortal
      transition="slide-up"
      transitionDuration={500}
      {...rest}
    >
      {props.children}
    </Modal>
  )
}
