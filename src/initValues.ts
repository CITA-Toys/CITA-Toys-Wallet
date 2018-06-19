import { LocalAccount } from './components/LocalAccounts/index'
import { IBlock, IBlockHeader, Transaction, Metadata } from './typings'
import { PanelConfigs } from './config/localstorage'

const isDesktop = window.innerWidth >= 800
console.log(isDesktop)
export const initHeader: IBlockHeader = {
  timestamp: '',
  prevHash: '',
  number: '',
  stateRoot: '',
  transactionsRoot: '',
  receiptsRoot: '',
  gasUsed: '',
  proof: {
    Tendermint: {
      proposal: '',
    },
  },
}
export const initBlock: IBlock = {
  body: {
    transactions: [],
  },
  hash: '',
  header: initHeader,
  version: 0,
}

export const initTransaction: Transaction = {
  hash: '',
  timestamp: '',
  content: '',
  basicInfo: {
    from: '',
    to: '',
    value: '',
    data: '',
  },
}
export const initMetadata: Metadata = {
  chainId: '',
  chainName: '',
  operator: '',
  website: '',
  genesisTimestamp: '',
  validators: [],
  blockInterval: 0,
}
export const initPanelConfigs: PanelConfigs = {
  logo: 'www.demo.com',
  TPS: true,
  blockHeight: true,
  blockHash: true,
  blockAge: isDesktop,
  blockTransactions: true,
  blockGasUsed: isDesktop,
  blockPageSize: 10,
  transactionHash: true,
  transactionFrom: isDesktop,
  transactionTo: isDesktop,
  transactionValue: isDesktop,
  transactionAge: isDesktop,
  transactionGasUsed: isDesktop,
  transactionBlockNumber: true,
  transactionPageSize: 10,
  graphIPB: true,
  graphTPB: true,
  graphGasUsedBlock: true,
  graphGasUsedTx: true,
  graphProposals: true,
  graphMaxCount: 100,
}
