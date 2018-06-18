/* eslint-disable import/prefer-default-export */
export const isIp = (ip: string) =>
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]{1,4}$/.test(
    ip,
  )
/* eslint-enable import/prefer-default-export */

export const isNull = (value: any) => value === null
