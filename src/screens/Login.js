import React from "react";
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Typography from '@material-ui/core/Typography';
import GoogleButton from 'react-google-button'


const styles = {
  divLogin: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    margin: '12px 0 19px 0'
  }
}

const Login = () => {
  const _signInWithGoogle = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
    }).catch(err => { console.log(err) })
  }

  return (
    <div style={styles.divLogin}>
      <Typography variant='h4'>ArquiCart - Consola de administración</Typography>
      <Typography variant='subtitle1' style={styles.loginText}>Esta es una zona restringida, ingresa con tu cuenta de Google para continuar:</Typography>
      <GoogleButton
        label='Ingresar con Google'
        onClick={_signInWithGoogle}
      />
    </div>
  );

}
export default Login;