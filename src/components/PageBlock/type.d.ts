export interface IPageBlock {
  title: string
  key: string
  path: string
  module: string
  index?: number
}
export interface PageBlockProps {
  displayName: string
  blocks: IPageBlock[]

  history: any
  location: any
  // match: any
  // index?: number
  children: React.ReactChild
}

export interface PageBlockState {
  loaded: boolean
}
