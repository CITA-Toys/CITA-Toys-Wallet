export const handleError = ctx => error => {
  ctx.setState(state => ({
    error,
  }))
}

export const dismissError = ctx => e => {
  ctx.setState({ error: { message: '', code: '' } })
}
