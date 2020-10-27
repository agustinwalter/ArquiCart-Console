import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  infoCard: {
    padding: '0 0 8px 12px',
    border: '1px solid grey',
    borderRadius: '5px',
    marginTop: '12px'
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
    width: 'calc(70vw - 92px)'
  },
  divBtns: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px'
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
  },
  infoSimple: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '12px',
    border: '1px solid grey',
    marginTop: '12px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: '.2s',
    '&:hover': {
      background: '#eeeeee'
    }
  },
  divBtns2: {
    display: 'flex',
    alignItems: 'start'
  }
}))
