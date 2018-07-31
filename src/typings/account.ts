/* eslint-disable no-restricted-globals */
export interface Contract {
  methods: {
    type: 'function' | 'event'
    name: string
    inputs: { name: string; type: string }[]
    outputs: { name: string; type: string }[]
  }[]
  _jsonInterface: {
    signature: string
  }[]
}
/* eslint-enable no-restricted-globals */
export enum AccountType {
  NORMAL = '普通账户',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
}
