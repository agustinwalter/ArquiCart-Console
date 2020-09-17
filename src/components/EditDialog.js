import React, { useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { Typography } from '@material-ui/core'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import './styles/edit-dialog.css'
import { makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import Fab from '@material-ui/core/Fab'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import AddressField from './AddressField'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(theme => ({
  btnAddExtraData: { marginTop: '6px' },
  textExtraData: { marginTop: '6px' },
  divActionBtns: { padding: '24px' },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
    paddingTop: '18px'
  },
  divDeleteImage: { background: 'none' },
  deleteBtn: {
    marginRight: '6px',
    marginBottom: '6px'
  },
  btnAddImages: { marginTop: '12px' },
  input: { display: 'none' }
}))

const EditDialog = ({ show, onClose, building, onBuildingUpdated }) => {
  const classes = useStyles()

  const [name, setName] = useState()
  const [address, setAddress] = useState()
  const [architects, setArchitects] = useState()
  const [description, setDescription] = useState()
  const [extraData, setExtraData] = useState([])
  const [images, setImages] = useState([])
  const [showAddDataDialog, setShowAddDataDialog] = useState(false)
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [location, setLocation] = useState()
  const [showOvelay, setShowOvelay] = useState({ display: 'none' })

  useEffect(() => {
    if (show) {
      setName(building.get('name'))
      setAddress(building.get('address'))
      setArchitects(building.get('architects'))
      setDescription(building.get('description'))
      setExtraData(building.get('extraData'))
      setLocation({
        lat: building.get('location')['w_'],
        lon: building.get('location')['m_']
      })
      const imagesDb = building.get('images')
      const images = []
      imagesDb.forEach(image => {
        images.push({
          image,
          isLocal: false
        })
      })
      setImages(images)
    }
  }, [building, show])

  useEffect(() => {
    if (!showAddDataDialog) {
      setKey('')
      setValue('')
    }
  }, [showAddDataDialog])

  const _deleteImage = image => {
    images[images.indexOf(image)].delete = true
    setImages([...images])
  }

  const _onSelectedAddress = newAddress => {
    setAddress(newAddress.formattedAddress)
    setLocation({
      lat: newAddress.lat,
      lon: newAddress.lng
    })
  }

  const _removeExtraData = data => {
    setExtraData(extraData.filter(d => d !== data))
  }

  const _addExtraData = () => {
    extraData.push({ key, value })
    setShowAddDataDialog(false)
  }

  const _manageImages = e => {
    const newLocalImages = []
    for (let i = 0; i < e.target.files.length; i++) {
      newLocalImages.push({
        image: e.target.files[i],
        isLocal: true
      })
    }
    if (newLocalImages.length > 0) {
      setImages(images.concat(newLocalImages))
    }
  }

  const _updateBuilding = async () => {
    setShowOvelay({ display: 'flex' })
    // Actualizo los datos del edificio
    await firebase
      .firestore()
      .doc(`buildings/${building.id}`)
      .update({
        name,
        address,
        architects,
        description,
        location: new firebase.firestore.GeoPoint(location.lat, location.lon),
        extraData,
        approved: false
        // approved: true
      })
    for (const image of images) {
      // Elimino las fotos que hay q eliminar
      if (image.delete && !image.isLocal) {
        await firebase.storage().refFromURL(image.image).delete()
        await firebase
          .firestore()
          .doc(`buildings/${building.id}`)
          .update({
            images: firebase.firestore.FieldValue.arrayRemove(image.image)
          })
      }
      // Subo las fotos que hay que subir
      if (!image.delete && image.isLocal) {
        let imageName = uuidv4()
        const name = image.image.name
        const lastDot = name.lastIndexOf('.')
        const ext = name.substring(lastDot + 1)
        imageName += `.${ext}`
        const snap = await firebase
          .storage()
          .ref()
          .child(`buildings/${imageName}`)
          .put(image.image)
        const downloadURL = await snap.ref.getDownloadURL()
        await firebase
          .firestore()
          .doc(`buildings/${building.id}`)
          .update({
            images: firebase.firestore.FieldValue.arrayUnion(downloadURL)
          })
      }
    }
    const updatedBuilding = await firebase
      .firestore()
      .doc(`buildings/${building.id}`)
      .get()
    onBuildingUpdated(updatedBuilding)
    setShowOvelay({ display: 'none' })
  }

  return (
    <React.Fragment>
      <Dialog open={show} scroll='body' onClose={onClose}>
        <DialogTitle>{'Editar información del edificio'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Los campos con * son obligatorios
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            variant='outlined'
            fullWidth
            required
            type='text'
            label='Nombre del edificio'
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <AddressField
            address={address}
            onSelectedAddress={_onSelectedAddress}
          />
          <TextField
            margin='dense'
            variant='outlined'
            type='text'
            fullWidth
            required
            label='Arquitecto/s'
            value={architects}
            onChange={e => setArchitects(e.target.value)}
          />
          <TextField
            margin='dense'
            variant='outlined'
            type='text'
            fullWidth
            required
            multiline
            rowsMax={15}
            label='Descripción'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <Typography variant='h6' className={classes.textExtraData}>
            Datos adicionales
          </Typography>
          {extraData.map(data => (
            <div
              className='div-extra-data'
              key={`extra-data-${data.key}-${data.value}`}
            >
              <Typography variant='body1'>
                <b>{data.key}:</b> {data.value}
              </Typography>
              <CloseRoundedIcon onClick={() => _removeExtraData(data)} />
            </div>
          ))}
          <Button
            color='primary'
            variant='outlined'
            fullWidth
            onClick={() => setShowAddDataDialog(true)}
            className={classes.btnAddExtraData}
          >
            Agregar datos
          </Button>
          <GridList className={classes.gridList} cols={2.5}>
            {images.map(image => {
              let imageUrl = image.image
              if (image.isLocal) imageUrl = URL.createObjectURL(image.image)
              if (image.delete) {
                return (
                  <div
                    key={`info-card-${imageUrl}`}
                    style={{ display: 'none' }}
                  ></div>
                )
              }
              return (
                <GridListTile key={`info-card-${imageUrl}`}>
                  <img src={imageUrl} alt='Foto de un edificio' />
                  <GridListTileBar
                    actionIcon={
                      <Fab
                        color='secondary'
                        size='small'
                        className={classes.deleteBtn}
                        onClick={() => _deleteImage(image)}
                      >
                        <DeleteRoundedIcon />
                      </Fab>
                    }
                    className={classes.divDeleteImage}
                  />
                </GridListTile>
              )
            })}
          </GridList>
          <input
            accept='.jpg, .jpeg, .png'
            className={classes.input}
            id='button-file'
            multiple
            type='file'
            onChange={_manageImages}
          />
          <label htmlFor='button-file'>
            <Button
              component='span'
              color='primary'
              variant='outlined'
              fullWidth
              className={classes.btnAddImages}
            >
              Subir imágenes
            </Button>
          </label>
        </DialogContent>
        <DialogActions className={classes.divActionBtns}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button color='primary' variant='contained' onClick={_updateBuilding}>
            Guardar y aprobar
          </Button>
        </DialogActions>
        {/* Loading overlay */}
        <div className='div-overlay' style={showOvelay}>
          <CircularProgress size={30} />
          <br />
          <Typography variant='body1'>
            Actualizando información, no cierres este diálogo hasta que el
            proceso finalice.
          </Typography>
        </div>
      </Dialog>
      {/* Add extra data dialog */}
      <Dialog
        open={showAddDataDialog}
        onClose={() => setShowAddDataDialog(false)}
      >
        <DialogTitle>{'Agrega un dato extra'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            variant='outlined'
            fullWidth
            type='text'
            label='Nombre del dato *'
            helperText='Ej.: "Año de inauguración"'
            value={key}
            onChange={e => setKey(e.target.value)}
          />
          <TextField
            margin='dense'
            variant='outlined'
            fullWidth
            type='text'
            label='Valor *'
            helperText='Ej.: "2008"'
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDataDialog(false)}>Cancelar</Button>
          <Button onClick={_addExtraData} color='primary'>
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default EditDialog
