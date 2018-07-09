import * as React from 'react'
import { createPortal } from 'react-dom'
import {
  Dialog,
  DialogTitle,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
} from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

const styles = require('./dialog.scss')

function Transition (props) {
  return <Slide direction="up" {...props} />
}

interface DialogCompProps {
  onClose: (e) => void
  on: boolean
  fullScreen?: boolean
  dialogTitle: string
  maxWidth?: 'xs' | 'sm' | 'md'
  children?: React.ReactNode
}
const DialogComp = (props: DialogCompProps) => (
  <Dialog
    fullScreen={props.fullScreen}
    onClose={props.onClose}
    open={props.on}
    maxWidth={props.maxWidth || 'md'}
    TransitionComponent={Transition}
  >
    {props.fullScreen ? (
      <AppBar position="sticky" color="default">
        <Toolbar className={styles.title}>
          <Typography variant="title" color="inherit">
            {props.dialogTitle}
          </Typography>
          <IconButton
            color="inherit"
            onClick={props.onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    ) : (
      <DialogTitle classes={{ root: styles.dialogTitle }}>
        {props.dialogTitle}
        <IconButton onClick={props.onClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
    )}
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
