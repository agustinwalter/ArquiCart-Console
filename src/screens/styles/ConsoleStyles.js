import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
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
    height: 'fit-content'
  },
  divPag: {
    width: 'calc(70vw - 36px)',
    padding: '16px 2px 26px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: 'border-box'
  }
}))
