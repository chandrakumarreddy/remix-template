import { IAccount } from './account'

export interface IOpportunityAccount extends Omit<IAccount, 'website'> {
  opportunities_count: number
}

type IPeople = {
  job_title: string
  linkedin_url: string
  location: string
  name: string
}

export type IOpportunity = {
  description: string
  events: string[]
  id: number
  keywords: string
  name: string
  typical_it_spend: string
  is_starred: boolean
  stakeholders_business: IPeople[]
  stakeholders_it: IPeople[]
}
