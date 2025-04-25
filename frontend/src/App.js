import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Layout from './components/Layout';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import AllPosts from './pages/AllPosts';
import MyPosts from './pages/MyPosts';
import PostForm from './pages/PostForm'
import { store, persistor } from './store';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/posts" element={<AllPosts />} />
              <Route path="/posts/new" element={<PostForm />} /> 
              <Route path="/posts/:id/edit" element={<PostForm />} />
              <Route path="/me/posts" element={<MyPosts />} />
              <Route path="/" element={<AllPosts />} />
            </Routes>
          </Layout>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;