export const handleError = ctx => error => {
  ctx.setState(state => ({
    error,
  }))
}

export const dismissError = ctx => e => {
  this.setState({ error: { message: '', code: '' } })
}
