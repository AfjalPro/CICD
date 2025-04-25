import React, { useEffect, useState } from 'react';
import { fetchItems } from '../api';
import { List, ListItem, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ token }) {
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    fetchItems(token).then(res => setItems(res.data.items));
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    nav('/login');
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Button onClick={logout}>Log Out</Button>
      <List>
        {items.map(i => <ListItem key={i.id}>{i.name}</ListItem>)}
      </List>
    </>
  );
}