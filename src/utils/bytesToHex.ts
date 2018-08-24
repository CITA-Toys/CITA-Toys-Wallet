/*
 * @Author: Keith-CY
 * @Date: 2018-07-22 21:11:24
 * @Last Modified by:   Keith-CY
 * @Last Modified time: 2018-07-22 21:11:24
 */

/* eslint-disable */
export default (bytes: Uint8Array) => {
  const hex: string[] = []
  for (let i = 0; i < bytes.length; i++) {
    /* jshint ignore:start */
    hex.push((bytes[i] >>> 4).toString(16))
    hex.push((bytes[i] & 0xf).toString(16))
    /* jshint ignore:end */
  }
  return `0x${hex.join('')}`
}
/* eslint-enable */
