export type Hash = string
export type BlockNumber = string
export type Timestamp = string | number
export interface IBlockHeader {
  timestamp: Timestamp
  prevHash: Hash
  number: BlockNumber
  stateRoot: string
  transactionsRoot: string
  receiptsRoot: string
  gasUsed: string
  proof: {
    Tendermint: {
      proposal: string
    }
  }
}
export interface Transaction {
  hash: Hash
}

export interface IBlock {
  body: {
    transactions: Transaction[]
  }
  hash: Hash
  header: IBlockHeader
  version: string | number
}
