import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Grid, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CourseCard from './CourseCard';
import  {useNavigate}  from 'react-router-dom';

const CourseList = ({ onCourseSelect }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8002/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };
    fetchCourses();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleCourseClick = (course) => {
    navigate(`/course/${course._id}`);
  };

  const filteredCourses = courses.filter((course) =>
    (course.name && course.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (course.instructor && course.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ margin: 4 }}>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          fullWidth
          placeholder="Search Course Name/Mentor"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderRadius: '25px',
                },
              },
            },
          }}
        />
      </Box>
      <Grid container spacing={3}>
        {filteredCourses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <CourseCard course={course} onClick={handleCourseClick} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CourseList;
