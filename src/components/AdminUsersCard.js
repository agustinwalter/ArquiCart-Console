import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

function AdminUsersCard({ adminData }) {
  const email = adminData.get('email')
  const photo = adminData.get('photo')

  return (
    <ListItem key={email} button>
      <ListItemAvatar>
        <Avatar
          alt={email}
          src={photo}
        />
      </ListItemAvatar>
      <ListItemText primary={email} />
    </ListItem>
  );
}

export default AdminUsersCard