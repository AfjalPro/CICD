// src/App.js
import React from 'react';
import Container from '@mui/material/Container';
import BlogPost from './BlogPost';

function App() {
  const samplePost = {
    title: 'Why React Is Taking Over the Front-End',
    author: 'Jane Doe',
    date: 'April 25, 2025',
    image: 'https://source.unsplash.com/random/800x400?code,react',
    content: `
React’s component-based architecture, virtual DOM diffing, and rich ecosystem
make it a top choice for building modern web applications. In this post,
we’ll dive into the core reasons behind its popularity:

1. **Reusability**: Build once, reuse everywhere.  
2. **Performance**: Virtual DOM updates only what changes.  
3. **Ecosystem**: From state-management (Redux, Zustand) to styling (MUI, Tailwind), you’re covered.

> “Learn once, write anywhere.” – React ethos

Start integrating React today and see your productivity skyrocket!
    `
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <BlogPost {...samplePost} />
    </Container>
  );
}

export default App;
