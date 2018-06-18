import * as React from 'react'
import { createPortal } from 'react-dom'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import AppBar from '@material-ui/core/AppBar/'
import Toolbar from '@material-ui/core/Toolbar/'
import IconButton from '@material-ui/core/IconButton/'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'

const styles = require('./styles.scss')

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
      <DialogTitle>{props.dialogTitle}</DialogTitle>
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
