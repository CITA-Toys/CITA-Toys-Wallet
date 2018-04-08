import * as React from 'react'
import { createPortal } from 'react-dom'
import Dialog, { DialogTitle } from 'material-ui/Dialog'

interface DialogCompProps {
  onClose: (e) => void
  on: boolean
  dialogTitle: string
  children?: React.ReactNode
}
const DialogComp = (props: DialogCompProps) => (
  <Dialog onClick={props.onClose} open={props.on}>
    <DialogTitle>{props.dialogTitle}</DialogTitle>
    {props.children}
  </Dialog>
)
export default class extends React.Component<DialogCompProps, {}> {
  render () {
    return createPortal(<DialogComp {...this.props} />, document.getElementById(
      'dialog',
    ) as HTMLElement)
  }
}
