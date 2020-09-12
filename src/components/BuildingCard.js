import React from 'react';
import Divider from '@material-ui/core/Divider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import IconButton from '@material-ui/core/IconButton';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  infoCard: {
    padding: "8px",
    border: "1px solid grey",
    borderRadius: "5px",
    marginTop: "18px"
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
  dividerInfo: {
    margin: '12px 0'
  },
  divBtns: {
    display: "flex",
    flexDirection: "column"
  },
  divInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  status: {
    fontSize: "14px",
    color: "#663c00",
    verticalAlign: "middle",
    background: "#fff4e5",
    padding: "3px 7px",
    border: "1px solid #663c00",
    borderRadius: "4px"
  },
  statusApro: {
    fontSize: "14px",
    color: "#1e4620",
    verticalAlign: "middle",
    background: "#edf7ed",
    padding: "3px 7px",
    border: "1px solid #1e4620",
    borderRadius: "4px"
  },
}))

function BuildingCard({ buildingData }) {
  const classes = useStyles();

  const name = buildingData.get('name')
  const architects = buildingData.get('architects')
  const address = buildingData.get('address')
  const extraData = buildingData.get('extraData')
  const description = buildingData.get('description')
  const images = buildingData.get('images')

  return (
    <div className={classes.infoCard}>
      {/* Info and buttons */}
      <div className={classes.divInfo}>
        {/* Info */}
        <div>
          <Typography variant="h6">
            {name} <span className={classes.statusApro}>Aprobado</span>
          </Typography>
          <Typography variant="body1">
          <b>Dirección:</b> {address}
          </Typography>
          <Typography variant="body1">
            <b>Arquitecto/s:</b> {architects}
          </Typography>
          {extraData.map((data) => (
            <Typography variant="body1" key={`data-${data.key}-${data.value}`}>
              <b>{data.key}:</b> {data.value}
            </Typography>
          ))}
        </div>
        {/* Buttons */}
        <div className={classes.divBtns}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<DoneRoundedIcon />}
          >
            Aprobado
          </Button>
          <br />
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<EditRoundedIcon />}
          >
            Editar
          </Button>
          <br />
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<DeleteRoundedIcon />}
          >
            Eliminar
          </Button>
        </div>
      </div>
      <Divider className={classes.dividerInfo} />
      {/* Description */}
      <Typography variant="body1">
        {description}
      </Typography>
      <Divider className={classes.dividerInfo} />
      {/* Images */}
      <GridList className={classes.gridList} cols={4.5}>
        {images.map((image) => (
          <GridListTile key={`info-card-${image}`}>
            <img src={image} alt='Foto de un edificio' />
            <GridListTileBar
              actionIcon={
                <IconButton aria-label={`delete ${image}`} color='secondary'>
                  <DeleteRoundedIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

export default BuildingCard