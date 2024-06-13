import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Avatar } from '@mui/material';
import { Star, School, AccessTime } from '@mui/icons-material';

const CourseCard = ({ course, onClick }) => {
  return (
    <Card sx={{ maxWidth: 345, cursor: 'pointer' }} onClick={onClick}>
      <CardMedia
        component="img"
        height="140"
        image={`http://localhost:8002${course.coverImage}`} // Correctly use the image path
        alt={course.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {course.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <Avatar alt={course.instructor} src={course.instructorAvatar} />
          <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 1 }}>
            {course.instructor}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
            <Star sx={{ color: '#fbc02d' }} />
            <Typography variant="body2" color="textSecondary">{course.rating}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <School sx={{ color: '#757575', marginRight: 0.5 }} />
          <Typography variant="body2" color="textSecondary">
            {course.modules} Modules
          </Typography>
          <AccessTime sx={{ color: '#757575', marginLeft: 2, marginRight: 0.5 }} />
          <Typography variant="body2" color="textSecondary">
            {course.duration}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
