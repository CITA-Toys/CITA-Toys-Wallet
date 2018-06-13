import axios, { AxiosResponse } from 'axios'

const url = path => {
  const ip = window.localStorage.getItem('chainIp') || process.env.CITA_SERVER
  return `${ip}/${path}`
}
export const fetch10Transactions = () =>
  axios
    .get(url('api/transactions'))
    .then((res: AxiosResponse) => res.data)
    .catch(err => console.error(err))

export const fetchBlocks = (params: { [index: string]: string | number }) =>
  axios
    .get(url('api/blocks'), { params })
    .then((res: AxiosResponse) => res.data)
    .catch(err => console.error(err))

export const fetchTransactions = (params: {
[index: string]: string | number
}) =>
  axios
    .get(url('api/transactions'), { params })
    .then((res: AxiosResponse) => res.data)
    .catch(err => console.error(err))

export const fetchStatistics = params =>
  axios
    .get(url('/api/statistics'), { params })
    .then((res: AxiosResponse) => res.data)
    .catch(err => console.error(err))
