import { Input, InputWrapper, PasswordInput } from '@mantine/core'
import type { ChangeEvent } from 'react'

import EyeIconHide from '~/assets/images/icons/eye-icon-hide.png'
import EyeIconShow from '~/assets/images/icons/eye-icon-show.png'
import { IInputComponentProps } from '~/types/input'

const InputComponent = ({
  id,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  disabled = false,
  inputClassNames,
  wrapperClassNames,
  inputRef,
  onFocus,
  onBlur,
  error,
  ...props
}: IInputComponentProps) => {
  return (
    <InputWrapper
      id={id}
      label={label}
      classNames={{
        label: 'body-small input-label',
        error: 'error body-small',
        ...wrapperClassNames,
      }}
      error={error}
    >
      <Input
        disabled={disabled}
        spellCheck="false"
        autoComplete="off"
        id={id}
        type={type}
        placeholder={placeholder}
        classNames={{
          input: `input body${error ? ' input-error' : ''}`,
          ...inputClassNames,
        }}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.value)
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
        ref={inputRef}
      />
    </InputWrapper>
  )
}

export const PasswordComponent = ({
  id,
  label,
  placeholder,
  value = '',
  onChange,
  disabled = false,
  ...rest
}: Omit<IInputComponentProps, 'type'>) => {
  return (
    <PasswordInput
      spellCheck="false"
      autoComplete="off"
      disabled={disabled}
      id={id}
      label={label}
      placeholder={placeholder}
      value={value}
      classNames={{
        label: 'body-small input-label',
        input: 'outer-input',
        innerInput: 'inner-input body',
        error: 'error body-small',
        invalid: 'error body-small',
      }}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(event.target.value)
      }
      visibilityToggleIcon={({ reveal }) => (
        <img
          src={reveal ? EyeIconHide : EyeIconShow}
          alt="show or hide password test"
          width="16"
          height="16"
        />
      )}
      {...rest}
    />
  )
}

export default InputComponent
