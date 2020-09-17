import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField'
import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import Typography from '@material-ui/core/Typography'
import './styles/address-field.css'
import { makeStyles } from '@material-ui/core/styles'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from 'use-places-autocomplete'

const useStyles = makeStyles(theme => ({
  divSelAdd: { paddingTop: '8px' },
  selAdd: { width: '-webkit-fill-available' },
  editIcon: { cursor: 'pointer' }
}))

const AddressField = ({ address, onSelectedAddress }) => {
  const classes = useStyles()

  const [showField, setShowField] = useState(false)
  const [newAddress, setNewAddress] = useState(address)
  const [searchMatches, setSearchMatches] = useState([])
  const [selectedAddress, setSelectedAddress] = useState({
    formattedAddress: address
  })
  const {
    ready,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete()

  useEffect(() => {
    if (status === 'OK') {
      let matches = []
      for (let i = 0; i < data.length; i++) {
        if (i === 4) break
        matches.push({
          formattedAddress: data[i].description
        })
      }
      setSearchMatches(matches)
    }
  }, [data, status])

  const _editAddress = () => {
    setShowField(true)
    setSelectedAddress(null)
  }

  const _findMatches = e => {
    const text = e.target.value
    setNewAddress(text)
    let search = false
    for (let i = 0; i < 10; i++) {
      if (text.includes(i)) {
        search = true
        break
      }
    }
    if (ready && search) setValue(text)
  }

  const _selectAddress = async match => {
    setShowField(false)
    setSelectedAddress(match)
    setSearchMatches([])
    setNewAddress(match.formattedAddress)
    clearSuggestions()
    const results = await getGeocode({ address: match.formattedAddress })
    const { lat, lng } = await getLatLng(results[0])
    onSelectedAddress({
      formattedAddress: match.formattedAddress,
      lat,
      lng
    })
  }

  const SearchMatches = () => {
    return (
      <div className='div-suggestions'>
        {searchMatches.map(match => (
          <Typography
            variant='body1'
            key={match.formattedAddress}
            onClick={() => _selectAddress(match)}
          >
            <LocationOnRoundedIcon />
            {match.formattedAddress}
          </Typography>
        ))}
      </div>
    )
  }

  const SelectedAddress = () => {
    return (
      <React.Fragment>
        <Typography variant='body2' className={classes.divSelAdd}>
          Dirección:
        </Typography>
        <div className='div-address-selected'>
          <LocationOnRoundedIcon color='primary' />
          <Typography variant='body1' className={classes.selAdd}>
            {selectedAddress.formattedAddress}
          </Typography>
          <EditRoundedIcon
            className={classes.editIcon}
            onClick={_editAddress}
          />
        </div>
      </React.Fragment>
    )
  }

  return (
    <div>
      {showField && (
        <TextField
          margin='dense'
          variant='outlined'
          fullWidth
          required
          type='text'
          label='Dirección'
          value={newAddress}
          onChange={_findMatches}
        />
      )}
      {searchMatches.length > 0 && <SearchMatches />}
      {selectedAddress != null && <SelectedAddress />}
    </div>
  )
}

export default AddressField
