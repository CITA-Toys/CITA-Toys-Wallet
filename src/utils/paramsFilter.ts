/*
 * @Author: Keith-CY
 * @Date: 2018-07-22 21:35:08
 * @Last Modified by:   Keith-CY
 * @Last Modified time: 2018-07-22 21:35:08
 */

export default params => {
  const p = {}
  Object.keys(params).forEach(key => {
    if (params[key] !== '' && typeof params[key] !== 'undefined') {
      p[key] = params[key]
    }
  })
  return p
}
