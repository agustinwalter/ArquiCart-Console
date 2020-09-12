import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  loader: {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
}

function Loading() {
  return (
    <div style={styles.loader}>
      <CircularProgress size={30} />
    </div>
  )
}

export default Loading