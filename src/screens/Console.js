import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import BuildingCard from '../components/BuildingCard'
import DeleteDialog from '../components/DeleteDialog'
import EditDialog from '../components/EditDialog'
import AdminUsersCard from '../components/AdminUsersCard'
import styles from './styles/ConsoleStyles'

const Console = () => {
  const c = styles()

  const [buildings, setBuildings] = useState([])
  const [admins, setAdmins] = useState([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [buildingToDelete, setBuildingToDelete] = useState()
  const [buildingToEdit, setBuildingToEdit] = useState()
  const [pages, setPages] = useState([])
  const [actualPage, setActualPage] = useState()

  const query = firebase
    .firestore()
    .collection(process.env.REACT_APP_BUILDINGS_COLL)
    .orderBy('approved')
    .orderBy('name') // Orenar por fecha de creación
    .limit(100)

  // Get buildings and admins
  useEffect(() => {
    // Get buildings
    firebase
      .firestore()
      .collection(process.env.REACT_APP_BUILDINGS_COLL)
      .orderBy('approved')
      .orderBy('name') // Orenar por fecha de creación
      .limit(100)
      .get()
      .then(snap => {
        if (!snap.empty) {
          setBuildings(snap.docs)
          setPages([snap.docs[0], snap.docs[snap.docs.length - 1]])
          setActualPage(0)
        }
      })
    // Get admins
    firebase
      .firestore()
      .collection(process.env.REACT_APP_USERS_COLL)
      .where('isAdmin', '==', true)
      .get()
      .then(snap => {
        if (!snap.empty) {
          setAdmins(snap.docs)
        }
      })
  }, [])

  const _signOut = () => {
    firebase.auth().signOut()
  }

  const _setShowDeleteDialog = building => {
    setBuildingToDelete(building)
    setShowDeleteDialog(true)
  }

  const _setShowEditDialog = building => {
    setBuildingToEdit(building)
    setShowEditDialog(true)
  }

  const _onBuildingUpdated = building => {
    const index = buildings.findIndex(b => b.id === building.id)
    buildings.splice(index, 1, building)
    setBuildings([...buildings])
    setShowEditDialog(false)
  }

  const _deleteBuilding = () => {
    firebase
      .firestore()
      .doc(`${process.env.REACT_APP_BUILDINGS_COLL}/${buildingToDelete.id}`)
      .delete()
    buildingToDelete.get('images').forEach(image => {
      try {
        firebase.storage().refFromURL(image).delete()
      } catch (error) {}
    })
    setBuildings(buildings.filter(item => item.id !== buildingToDelete.id))
    setBuildingToDelete()
    setShowDeleteDialog(false)
  }

  const nextPage = () => {
    startAfter(pages[actualPage + 1], actualPage + 1)
    window.scrollTo(0, 0)
  }

  const prevPage = () => {
    if (actualPage === 1) {
      query
        .startAt(pages[actualPage - 1])
        .get()
        .then(snap => {
          if (!snap.empty) {
            setBuildings(snap.docs)
            setActualPage(actualPage - 1)
          }
        })
    } else startAfter(pages[actualPage - 1], actualPage - 1)
    window.scrollTo(0, 0)
  }

  const startAfter = (after, page) => {
    query
      .startAfter(after)
      .get()
      .then(snap => {
        if (!snap.empty) {
          setBuildings(snap.docs)
          setActualPage(page)
          if (actualPage + 1 === pages.length - 1)
            setPages([...pages, snap.docs[snap.docs.length - 1]])
        }
      })
  }

  return (
    <React.Fragment>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' style={{ flexGrow: 1 }}>
            ArquiCart - Consola de administración
          </Typography>
          <Button color='inherit' onClick={_signOut}>
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>
      {/* Console */}
      <div className={c.divContent}>
        {/* Left card */}
        <Paper elevation={3} className={c.left}>
          <Typography variant='h6' style={{ flexGrow: 1 }}>
            Información de edificios
          </Typography>
          {buildings.map(building => {
            return (
              <BuildingCard
                key={building.id}
                buildingData={building}
                confirmDelete={() => _setShowDeleteDialog(building)}
                showEditDialog={() => _setShowEditDialog(building)}
              />
            )
          })}
        </Paper>
        {/* Right card */}
        <Paper elevation={3} className={c.right}>
          <Typography variant='h6' style={{ flexGrow: 1 }}>
            Administradores actuales
          </Typography>
          {admins.map(admin => {
            return <AdminUsersCard adminData={admin} key={admin.id} />
          })}
        </Paper>
      </div>

      {/* Pagination */}
      <div className={c.divPag}>
        <Button
          variant='contained'
          color='primary'
          onClick={prevPage}
          disabled={Boolean(actualPage === 0)}
        >
          Anterior
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={nextPage}
          disabled={Boolean(buildings.length < 100)}
        >
          Siguiente
        </Button>
      </div>

      {/* Delete dielog */}
      <DeleteDialog
        show={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={_deleteBuilding}
      />
      {/* Edit dialog */}
      {buildingToEdit && (
        <EditDialog
          show={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          building={buildingToEdit}
          onBuildingUpdated={_onBuildingUpdated}
        />
      )}
    </React.Fragment>
  )
}

export default Console
