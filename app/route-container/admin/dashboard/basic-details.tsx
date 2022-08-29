import { Button, Select, SimpleGrid } from '@mantine/core'

import caretDownIcon from '~/assets/images/icons/carat-down.svg'
import InputComponent from '~/components/input-component'
import { useGetCountries } from '~/hooks/accounts'
import useAccountsStore from '~/store/accounts'
import { IDetailsProps } from '~/types/account'

const BasicDetails = ({ setActive, handleClose }: IDetailsProps) => {
  const { data: countries } = useGetCountries()
  const _countries = countries?.map((country) => ({
    label: country,
    value: country,
  }))
  const [newAccountData, setNewAccountData] = useAccountsStore((store) => [
    store.newAccountData,
    store.setNewAccountData,
  ])
  const { fname, sname, email, country } = newAccountData
  const isValid = fname && sname && email && country
  return (
    <>
      <div className="basic-details-container">
        <div className="basic-details">
          <SimpleGrid cols={2} spacing={24}>
            <InputComponent
              label="First Name"
              id="first-name"
              placeholder="Enter the first name"
              value={fname}
              onChange={(value) => setNewAccountData({ fname: value })}
            />
            <InputComponent
              label="Last Name"
              id="last-name"
              placeholder="Enter the last name"
              value={sname}
              onChange={(value) => setNewAccountData({ sname: value })}
            />
          </SimpleGrid>
          <InputComponent
            label="Email"
            id="email-id"
            type="email"
            placeholder="Official email address"
            value={email}
            onChange={(value) => setNewAccountData({ email: value })}
          />
          <Select
            searchable
            autoComplete="none"
            aria-autocomplete="none"
            label="Region"
            placeholder="Region"
            data={_countries ?? []}
            rightSection={<img src={caretDownIcon} alt="show more options" />}
            classNames={{
              label: 'body-small',
              input: 'input body',
              item: 'select-item body-small',
              selected: 'select-item-selected',
            }}
            value={country}
            onChange={(value) => setNewAccountData({ country: value || '' })}
          />
        </div>
      </div>
      <div className="basic-details-footer">
        <Button
          variant="outline"
          className="body-small fw-600 cancel"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          className="body fw-600 next"
          onClick={() => setActive((s: number) => s + 1)}
          disabled={!isValid}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default BasicDetails
