import React, { useState } from 'react'
import Divider from '@material-ui/core/Divider'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import DoneRoundedIcon from '@material-ui/icons/DoneRounded'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import * as firebase from 'firebase/app'
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded'
import IconButton from '@material-ui/core/IconButton'
import 'firebase/firestore'
import styles from './styles/BuildingCard'
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded'

function BuildingCard({ buildingData, confirmDelete, showEditDialog }) {
  const c = styles()

  const name = buildingData.get('name')
  const architects = buildingData.get('architects')
  const address = buildingData.get('address')
  const extraData = buildingData.get('extraData')
  const description = buildingData.get('description')
  const images = buildingData.get('images')
  const [approved, setApproved] = useState(buildingData.get('approved'))
  const [expanded, setExpanded] = useState(false)

  const _approveBuilding = () => {
    firebase
      .firestore()
      .doc(`${process.env.REACT_APP_BUILDINGS_COLL}/${buildingData.id}`)
      .update({
        approved: !approved
      })
    setApproved(!approved)
  }

  const handleExpand = () => {
    setExpanded(!expanded)
  }

  const Approved = () => {
    if (approved) return <span className={c.statusApro}>Aprobado</span>
    else return <span className={c.status}>En revisión</span>
  }

  if (!expanded) {
    return (
      <div className={c.infoSimple} onClick={handleExpand}>
        <Typography variant='h6'>
          {name} <Approved />
        </Typography>
        <IconButton style={{ padding: '6px' }}>
          <ExpandMoreRoundedIcon fontSize='large' />
        </IconButton>
      </div>
    )
  }
  return (
    <div className={c.infoCard}>
      {/* Info and buttons */}
      <div className={c.divInfo}>
        {/* Info */}
        <div style={{ marginTop: '8px' }}>
          <Typography variant='h6'>
            {name} <Approved />
          </Typography>
          {address !== '' && (
            <Typography variant='body1'>
              <b>Dirección:</b> {address}
            </Typography>
          )}
          <Typography variant='body1'>
            <b>Arquitecto/s:</b> {architects}
          </Typography>
          {extraData.map(data => (
            <Typography variant='body1' key={`data-${data.key}-${data.value}`}>
              <b>{data.key}:</b> {data.value}
            </Typography>
          ))}
        </div>
        {/* Buttons */}
        <div className={c.divBtns2}>
          <div className={c.divBtns}>
            <Button
              variant='contained'
              color='primary'
              size='small'
              onClick={_approveBuilding}
              startIcon={<DoneRoundedIcon />}
            >
              {approved ? 'Aprobado' : 'Aprobar'}
            </Button>
            <Button
              variant='contained'
              color='primary'
              size='small'
              onClick={showEditDialog}
              style={{ margin: '12px 0' }}
              startIcon={<EditRoundedIcon />}
            >
              Editar
            </Button>
            <Button
              variant='contained'
              color='secondary'
              size='small'
              onClick={confirmDelete}
              startIcon={<DeleteRoundedIcon />}
            >
              Eliminar
            </Button>
          </div>
          {/* Close button */}
          <IconButton style={{ padding: '6px' }} onClick={handleExpand}>
            <ExpandLessRoundedIcon fontSize='large' />
          </IconButton>
        </div>
      </div>
      <Divider style={{ margin: '12px 12px 12px 0' }} />
      {/* Description */}
      <Typography variant='body1' style={{ marginRight: '12px' }}>
        {description}
      </Typography>
      <Divider style={{ margin: '12px 12px 12px 0' }} />
      {/* Images */}
      <GridList className={c.gridList} cols={4.5}>
        {images.map(image => (
          <GridListTile key={`info-card-${image}`}>
            <img src={image} alt='Foto de un edificio' />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}

export default BuildingCard
