import type { InputBaseProps } from '@mantine/core'
import type { FocusEvent, RefObject } from 'react'

export interface IInputComponentProps<
  T = string | number | readonly string[] | undefined
> extends InputBaseProps {
  id?: string
  label?: string
  placeholder: string
  type?: string
  value: T
  onChange: (value: string) => void
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
  name?: string
  disabled?: boolean
  inputRef?: RefObject<HTMLInputElement>
  inputClassNames?: {
    input?: string
    icon?: string
  }
  wrapperClassNames?: {
    root?: string
  }
  error?: string
}
