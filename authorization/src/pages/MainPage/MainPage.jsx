import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import UserPage from '../UserPage/UserPage';
import AdminPage from '../AdminPage/AdminPage';
import './MainPage.css';

const MainPage = () => {
  const { isAuth, email, isAdmin } = useAuth();
  if (isAuth) {
    if (isAdmin)
      return (
        <UserPage
          isAuth={isAuth}
          email={email}
        />
      );
    return <AdminPage />;
  }
  return <Navigate to='/login' />;
};

export default MainPage;
