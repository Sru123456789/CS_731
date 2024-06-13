import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import { Home, Book, Create, ExitToApp } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const TeacherSidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '16px', justifyContent: 'center' }}>
        <img src="/teachercomponents/121212.jpg" alt="DeCourses Logo" style={{ width: '40px', marginRight: '8px' }} />
        <Typography variant="h6">DeCourses</Typography>
      </Box>
      <List>
        <ListItem button component={Link} to="/teacher/mycourses" sx={{ paddingLeft: '16px' }}>
          <ListItemIcon><Book /></ListItemIcon>
          <ListItemText primary="My Courses" />
        </ListItem>
        <ListItem button component={Link} to="/createcourse" sx={{ paddingLeft: '16px' }}>
          <ListItemIcon><Create /></ListItemIcon>
          <ListItemText primary="Create Course" />
        </ListItem>
        <ListItem button component={Link} to="/" sx={{ paddingLeft: '16px' }}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default TeacherSidebar;
