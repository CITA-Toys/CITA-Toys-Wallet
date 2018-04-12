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
  content: string
  // content: string
  // id: string
  // from: Hash
  // to: Hash
  // tokenValue: string
  // timestamp: Timestamp
}

export interface DetailedTransaction {
  hash: Hash
  content: string
  blockHash: Hash
  blockNumber: string
  index: string
}

export interface IBlock {
  body: {
    transactions: Transaction[]
  }
  hash: Hash
  header: IBlockHeader
  version: string | number
}
