// src/BlogPost.js
import React from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Divider
} from '@mui/material';

export default function BlogPost({ title, author, date, image, content }) {
  return (
    <Card elevation={3}>
      <CardHeader
        title={<Typography variant="h4">{title}</Typography>}
        subheader={`${author} • ${date}`}
        sx={{ pb: 0 }}
      />
      <CardMedia
        component="img"
        height="300"
        image={image}
        alt={title}
      />
      <CardContent>
        <Typography
          component="div"
          variant="body1"
          sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
        >
          {content}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Your Blog Name
        </Typography>
      </CardContent>
    </Card>
  );
}
