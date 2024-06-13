import React from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { Home, Book, ExitToApp } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
   
    navigate('/');
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
        <Box sx={{ width: 40, height: 40, backgroundColor: 'gray', borderRadius: '50%' }} />
        <Typography variant="h6" sx={{ marginLeft: 2, color: '#343a40' }}>DeCourses</Typography>
      </Box>
      <List>
      <ListItem button component={Link} to="/student/explorecourses">
          <Home sx={{ color: '#343a40' }} />
          <ListItemText primary="Explore Courses" sx={{ marginLeft: 2, color: '#343a40' }} />
        </ListItem>
        <ListItem button component={Link} to="/student/mycourses">
          <Book sx={{ color: '#343a40' }} />
          <ListItemText primary="My Courses" sx={{ marginLeft: 2, color: '#343a40' }} />
        </ListItem>
        
        <ListItem button onClick={handleLogout}>
          <ExitToApp sx={{ color: '#343a40' }} />
          <ListItemText primary="Logout" sx={{ marginLeft: 2, color: '#343a40' }} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
