import React from "react"
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

const DeleteDialog = ({ show, onClose, onConfirm }) => {
  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>{"¿Deseas eliminar este edificio?"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Se eliminará toda la información del edificio.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="secondary">
          Si, eliminar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog