import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import UserPage from '../UserPage/UserPage';
import './MainPage.css';

const MainPage = () => {
  const { isAuth, email, isAdmin } = useAuth();
  return isAuth ? (
    <UserPage
      isAuth={isAuth}
      email={email}
    />
  ) : (
    <Navigate to='/login' />
  );
};

export default MainPage;
