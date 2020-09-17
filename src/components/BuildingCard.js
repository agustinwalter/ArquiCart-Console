import React, { useState } from 'react'
import Divider from '@material-ui/core/Divider'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import DoneRoundedIcon from '@material-ui/icons/DoneRounded'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

const useStyles = makeStyles(() => ({
  infoCard: {
    padding: '8px',
    border: '1px solid grey',
    borderRadius: '5px',
    marginTop: '18px'
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)'
  },
  dividerInfo: {
    margin: '12px 0'
  },
  divBtns: {
    display: 'flex',
    flexDirection: 'column'
  },
  divInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start'
  },
  status: {
    fontSize: '14px',
    color: '#663c00',
    verticalAlign: 'middle',
    background: '#fff4e5',
    padding: '3px 7px',
    border: '1px solid #663c00',
    borderRadius: '4px'
  },
  statusApro: {
    fontSize: '14px',
    color: '#1e4620',
    verticalAlign: 'middle',
    background: '#edf7ed',
    padding: '3px 7px',
    border: '1px solid #1e4620',
    borderRadius: '4px'
  }
}))

function BuildingCard({ buildingData, confirmDelete, showEditDialog }) {
  const classes = useStyles()

  const name = buildingData.get('name')
  const architects = buildingData.get('architects')
  const address = buildingData.get('address')
  const extraData = buildingData.get('extraData')
  const description = buildingData.get('description')
  const images = buildingData.get('images')
  const [approved, setApproved] = useState(buildingData.get('approved'))

  const _approveBuilding = () => {
    firebase.firestore().doc(`buildings/${buildingData.id}`).update({
      approved: !approved
    })
    setApproved(!approved)
  }

  const Approved = () => {
    if (approved) {
      return <span className={classes.statusApro}>Aprobado</span>
    } else {
      return <span className={classes.status}>En revisión</span>
    }
  }

  return (
    <div className={classes.infoCard}>
      {/* Info and buttons */}
      <div className={classes.divInfo}>
        {/* Info */}
        <div>
          <Typography variant='h6'>
            {name} <Approved />
          </Typography>
          <Typography variant='body1'>
            <b>Dirección:</b> {address}
          </Typography>
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
        <div className={classes.divBtns}>
          <Button
            variant='contained'
            color='primary'
            size='small'
            onClick={_approveBuilding}
            startIcon={<DoneRoundedIcon />}
          >
            {approved ? 'Aprobado' : 'Aprobar'}
          </Button>
          <br />
          <Button
            variant='contained'
            color='primary'
            size='small'
            onClick={showEditDialog}
            startIcon={<EditRoundedIcon />}
          >
            Editar
          </Button>
          <br />
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
      </div>
      <Divider className={classes.dividerInfo} />
      {/* Description */}
      <Typography variant='body1'>{description}</Typography>
      <Divider className={classes.dividerInfo} />
      {/* Images */}
      <GridList className={classes.gridList} cols={4.5}>
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
