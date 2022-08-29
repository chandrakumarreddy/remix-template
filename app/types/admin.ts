import type { ReactElement } from 'react'
import type { Row } from 'react-table'

import { IUserAccount } from './account'

export interface ICheckboxData extends IUserAccount {
  _accounts: ReactElement
}

export interface ITableHeadCheckbox {
  data: ICheckboxData[]
}

export interface ITableRow {
  row: Row<ICheckboxData>
}
