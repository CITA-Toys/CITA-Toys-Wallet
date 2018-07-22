/*
 * @Author: Keith-CY
 * @Date: 2018-07-22 21:11:41
 * @Last Modified by: Keith-CY
 * @Last Modified time: 2018-07-22 21:33:29
 */

import axios, { AxiosResponse } from 'axios'
import { initServerList } from '../initValues'

const baseURL = window.localStorage.getItem('chainIp') || initServerList[0]

const axiosIns = axios.create({
  baseURL,
})

interface Params {
  [index: string]: string | number
}

export const fetch10Transactions = () =>
  axiosIns
    .get('api/transactions')
    .then((res: AxiosResponse) => res.data)
    .catch(err => console.error(err))

export const fetchBlocks = (params: Params) =>
  axiosIns
    .get('api/blocks', { params })
    .then((res: AxiosResponse) => res.data)
    .catch(err => console.error(err))

export const fetchTransactions = (params: Params) =>
  axiosIns
    .get('api/transactions', { params })
    .then((res: AxiosResponse) => res.data)
    .catch(err => console.error(err))

export const fetchStatistics = params =>
  axiosIns
    .get('/api/statistics', { params })
    .then((res: AxiosResponse) => res.data)
    .catch(err => console.error(err))
