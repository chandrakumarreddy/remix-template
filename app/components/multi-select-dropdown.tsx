import { Button, Checkbox, Paper, ScrollArea } from '@mantine/core'
import {
  useClickOutside,
  useDebouncedValue,
  useDisclosure,
} from '@mantine/hooks'
import type { FC, ReactNode, RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

import CarotDown from '~/assets/images/icons/carat-down.svg'
import styles from '~/styles/components/multi-select-dropdown.css'
import { IInputComponentProps } from '~/types/input'

import InputComponent from './input-component'

export const multiSelectStyles = [{ rel: 'stylesheet', href: styles }]

export type TData = { value: string | number | boolean; label: string }

interface IMultiSelect {
  data: TData[]
}

interface TMultiSelectDropDownProps
  extends Omit<IInputComponentProps, 'inputRef' | 'value' | 'onChange'> {
  onChange?: (val: TData[]) => void
  onSearch?: (val: string) => void
  onCloseDropDown?: (val: TData[]) => void
  RenderChildren?: FC<{ handleItemClick: (value: TData) => void }>
  defaultItems?: TData[]
  rootClassName?: string
  containerClassName?: string
  notFound?: string | ReactNode
}

export default function MultiSelectDropDown(
  props: TMultiSelectDropDownProps & IMultiSelect
) {
  const {
    label,
    onChange,
    RenderChildren,
    defaultItems = [],
    inputClassNames,
    rootClassName = '',
    containerClassName = '',
    notFound = 'No Items found for this search',
    onCloseDropDown,
    onSearch,
    ...restProps
  } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const [opened, handlers] = useDisclosure(false)
  const ref = useClickOutside(handlers.close)
  const [value, setValue] = useState('')
  const [debouncedValue] = useDebouncedValue(value, 300)
  const [selectedItems, setSelectedItems] = useState<TData[]>(defaultItems)
  const _selectedItemsLabels = selectedItems.map((item) => item.value)
  const handleItemClick = (item: TData) => {
    const items = _selectedItemsLabels.includes(item.value)
      ? selectedItems.filter((_value) => _value.value !== item.value)
      : [...selectedItems, item]
    setSelectedItems(items)
    selectedItemsRef.current = items
    onChange?.(items)
  }
  const filteredData = props.data?.filter((item) =>
    item.label.toLowerCase().includes(debouncedValue.toLowerCase())
  )
  const selectedItemsRef = useRef(selectedItems)
  useEffect(() => {
    return () => {
      if (opened) {
        onCloseDropDown?.(selectedItemsRef.current)
      }
    }
  }, [opened])
  useEffect(() => {
    onSearch?.(debouncedValue)
  }, [debouncedValue])
  return (
    <div className={rootClassName}>
      {label && (
        <label htmlFor={restProps.id} className="body-small mb-4">
          {label}
        </label>
      )}
      <div
        className={`multi-select-container ${containerClassName}${
          label ? ' label' : ''
        }`}
        ref={ref}
      >
        <InputComponent
          {...restProps}
          inputClassNames={{
            input: 'input body-small',
            ...inputClassNames,
          }}
          rightSection={
            <img
              src={CarotDown}
              width="16"
              height="16"
              alt="click to add more accounts"
            />
          }
          onFocus={() => {
            if (opened) return
            handlers.open()
          }}
          value={value}
          onChange={(_value) => setValue(_value)}
          inputRef={inputRef}
        />
        {opened && props.data && (
          <DropDown
            data={filteredData}
            selectedItems={_selectedItemsLabels}
            handleItemClick={handleItemClick}
            inputRef={inputRef}
            notFound={notFound}
          />
        )}
      </div>
      {RenderChildren && <RenderChildren handleItemClick={handleItemClick} />}
    </div>
  )
}

interface IDropDownProps extends IMultiSelect {
  selectedItems: (string | number | boolean)[]
  handleItemClick: (value: TData) => void
  inputRef: RefObject<HTMLInputElement>
  notFound?: string | ReactNode
}
const DropDown = ({
  data,
  selectedItems,
  handleItemClick,
  inputRef,
  notFound,
}: IDropDownProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'initial'
    }
  }, [])
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [selectedItems.length])
  return (
    <Paper className="multi-select-dropdown">
      <ScrollArea style={{ maxHeight: 400 }} scrollbarSize={0}>
        {data.length ? (
          data.map((item) => (
            <div
              key={item.label}
              className="multi-select-dropdown-item"
              tabIndex={0}
            >
              <Checkbox
                className="multi-select-checkbox"
                width="20px"
                height="20px"
                checked={selectedItems.includes(item.value)}
                tabIndex={-1}
                onChange={() => {
                  handleItemClick(item)
                }}
              />
              <Button
                classNames={{
                  root: 'multi-select-dropdown-button body-small',
                  label: 'multi-select-dropdown-button-label',
                }}
                onClick={() => handleItemClick(item)}
                tabIndex={-1}
              >
                {item.label}
              </Button>
            </div>
          ))
        ) : typeof notFound === 'string' ? (
          <div className="multi-select-dropdown__notFound">
            <p className="body-regular center">{notFound}</p>
          </div>
        ) : (
          notFound
        )}
      </ScrollArea>
    </Paper>
  )
}
