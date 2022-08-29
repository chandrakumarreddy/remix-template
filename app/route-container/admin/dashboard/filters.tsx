import { Button, Select } from '@mantine/core'
import type { ReactNode } from 'react'

import FilterIcon from '~/assets/images/icons/filter.svg'
import SearchIcon from '~/assets/images/icons/search.svg'
import InputComponent from '~/components/input-component'
import useAccountsStore from '~/store/accounts'

const Filters = ({ child }: { child: ReactNode }) => {
  const [filters, setFilters] = useAccountsStore((store) => [
    store.filters,
    store.setFilters,
  ])
  return (
    <section id="admin-dashboard" className="admin-dashboard__filters">
      <h3>Manage salesperson</h3>
      <div className="admin-dashboard__header">
        <div className="admin-dashboard__header-left">
          <InputComponent
            id="search"
            placeholder="Search"
            inputClassNames={{
              input: 'input admin-dashboard__header-input body-small',
            }}
            type="text"
            icon={
              <img
                src={SearchIcon}
                width="20"
                height="20"
                alt="click here to search"
              />
            }
            value={filters.searchKey}
            onChange={(value: string) => setFilters({ searchKey: value })}
          />
          <Select
            autoComplete="none"
            aria-autocomplete="none"
            placeholder="Invitation status"
            data={[
              { value: 'Signed up', label: 'Signed up' },
              { value: 'Did not sign up', label: 'Did not sign up' },
            ]}
            rightSection={<img src={FilterIcon} alt="show more options" />}
            classNames={{
              input: `input admin-dashboard__header-select body-small${
                filters.activated ? ' selected' : ''
              }`,
              item: 'select-item body-small',
              selected: 'select-item-selected',
              label: 'body-small',
            }}
            value={filters.activated}
            onChange={(value: 'Did not sign up' | 'Signed up') =>
              setFilters({ activated: value })
            }
          />
          <ResetButton />
        </div>
        {child}
      </div>
    </section>
  )
}

const ResetButton = () => {
  const setFilters = useAccountsStore((store) => store.setFilters)
  return (
    <Button
      variant="outline"
      className="clear-btn body-small fw-600"
      onClick={() => setFilters({}, true)}
    >
      Clear all
    </Button>
  )
}

export default Filters
