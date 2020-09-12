import React, { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import BuildingCard from '../components/BuildingCard'
import AdminUsersCard from '../components/AdminUsersCard'

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  divContent: {
    display: 'flex',
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    boxSizing: 'border-box'
  },
  left: {
    width: '70%',
    padding: theme.spacing(1),
    height: 'fit-content',
    marginRight: theme.spacing(2)
  },
  right: {
    width: '30%',
    padding: theme.spacing(1),
    height: 'fit-content',
  }
}))

const Console = () => {
  const classes = useStyles()

  const [buildings, setBuildings] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    firebase.firestore().collection('buildings').limit(10).get().then(snap => {
      if(!snap.empty){
        setBuildings(snap.docs)
      }
    })
    firebase.firestore().collection('users').where('isAdmin', '==', true).get().then(snap => {
      if(!snap.empty){
        setAdmins(snap.docs)
      }
    })
  }, [])

  const _signOut = () => {
    firebase.auth().signOut()
  }

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            ArquiCart - Consola de administración
          </Typography>
          <Button color="inherit" onClick={_signOut}>Cerrar sesión</Button>
        </Toolbar>
      </AppBar>
      <div className={classes.divContent}>
        {/* Left card */}
        <Paper elevation={3} className={classes.left}>
          <Typography variant="h6" className={classes.title}>
            Información de edificios
          </Typography>
          {buildings.map((building) => {
            return <BuildingCard buildingData={building} key={building.id} />
          })}
        </Paper>
        {/* Right card */}
        <Paper elevation={3} className={classes.right}>
          <Typography variant="h6" className={classes.title}>
            Administradores actuales
          </Typography>
          {admins.map((admin) => {
            return <AdminUsersCard adminData={admin} key={admin.id} />
          })}
        </Paper>
      </div>
    </React.Fragment>
  );
}

export default Console;