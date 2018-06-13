export default params => {
  const p = {}
  Object.keys(params).forEach(key => {
    if (params[key] !== '' || typeof params[key] !== 'undefined') {
      p[key] = params[key]
    }
  })
  return p
}
