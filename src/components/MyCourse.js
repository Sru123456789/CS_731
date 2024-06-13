import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Tabs, Tab, Button, Divider, IconButton, Collapse } from '@mui/material';
import { School, AccessTime, People, Add, Remove } from '@mui/icons-material';
import axios from 'axios';

import Sidebar from './Sidebar'; // Ensure the Sidebar component is imported

const MyCourse = () => {
  const [tabValue, setTabValue] = useState(0);
  const [weekContentVisible, setWeekContentVisible] = useState({
    week1: false,
    week2: false,
    week3: false,
    week4: false,
    week5: false,
  });
  const [user, setUser] = useState(null); // Initialize user state with null
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        // Retrieve user data from local storage
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
  
        // Get the user's authentication token from the stored user data
        const token = userData.token;
        if (!token) {
          console.error('Authentication token not found in user data:', userData);
          return; // Exit the function if token is not found
        }
        
        // Make a request to get the logged-in user's data
        const userDataResponse = await axios.get('http://localhost:8002/api/user', {
          headers: {
            Authorization: token // Include the token in the request header
          }
        });
  
        console.log("User data:", userDataResponse.data);
        const userEmail = userDataResponse.data.email;
        // Make a request to fetch user courses based on their email
        const coursesResponse = await axios.get(`http://localhost:8002/api/courses/user/${userEmail}`, {
          headers: {
            Authorization: token // Include the token in the request header
          }
        });
  
        console.log("Courses:", coursesResponse.data.courses);
  
        // Update state with user and courses data
        setUser(userDataResponse.data);
        setCourses(coursesResponse.data.courses);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleWeekToggle = (week) => {
    setWeekContentVisible((prev) => ({
      ...prev,
      [week]: !prev[week],
    }));
  };

  const handleLogout = () => {
    console.log('User logged out');
  };

  if (!user) {
    // Render loading state while user data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#3f51b5', flexGrow: 1 }}>
            My Courses
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: { xs: 2, md: 0 } }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5', marginRight: 2 }}>{user.name}</Typography>
            <Avatar alt={user.name} src={user.avatar} sx={{ width: 48, height: 48 }} />
          </Box>
        </Box>
        {/* Render courses */}
        {courses.map(course => (
          <div key={course._id}>
            {/* Render course details here */}
            <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                {course.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ marginTop: '8px' }}>
                {course.description}
              </Typography>
              {/* Add additional course details here */}
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2, marginBottom: 3, flexWrap: 'wrap' }}>
                <Avatar alt={course.instructor} src={course.instructorAvatar} sx={{ marginRight: 2, width: 64, height: 64 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>{course.instructor}</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {course.instructorTitle}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                <People sx={{ color: '#3f51b5', marginRight: 1 }} />
                <Typography variant="body1" color="textSecondary" sx={{ marginRight: 4 }}>
                  <strong>{course.students.length} Students</strong>
                </Typography>
                {/* <School sx={{ color: '#3f51b5', marginRight: 1 }} /> */}
                {/* <Typography variant="body1" color="textSecondary" sx={{ marginRight: 4 }}>
                  <strong>{course.modules} Modules</strong>
                </Typography> */}
                {/* <AccessTime sx={{ color: '#3f51b5', marginRight: 1 }} />
                <Typography variant="body1" color="textSecondary" sx={{ marginRight: 4 }}>
                  <strong>{course.duration}</strong>
                </Typography> */}
                {/* <Typography variant="body1" color="textSecondary">
                  <strong>{course.credits} Hours</strong>
                </Typography> */}
              </Box>
              <Divider sx={{ marginBottom: 3 }} />
              <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                <Tab label="Materials" />
              </Tabs>
              <Box sx={{ marginTop: 4 }}>
                {[1, 2, 3, 4, 5].map((week) => (
                  <Box key={`week${week}`} sx={{ marginBottom: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ borderColor: '#3f51b5', color: '#3f51b5', display: 'flex', justifyContent: 'space-between' }}
                      onClick={() => handleWeekToggle(`week${week}`)}
                    >
                      WEEK {week}
                      <IconButton size="small" sx={{ color: '#3f51b5' }}>
                        {weekContentVisible[`week${week}`] ? <Remove /> : <Add />}
                      </IconButton>
                    </Button>
                    <Collapse in={weekContentVisible[`week${week}`]}>
                      <Box sx={{ p: 2, border: '1px solid #3f51b5', borderTop: 'none' }}>
                        {tabValue === 0 ? (
                          <Typography variant="body2">Content for Week {week}</Typography>
                        ) : (
                          <Typography variant="body2">Assignments for Week {week}</Typography>
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                ))}
              </Box>
            </Box>
          </div>
        ))}
        {/* End rendering courses */}
      </Box>
    </Box>
  );
};

export default MyCourse;
