import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { useDispatch } from 'react-redux';
import { removeUser } from '../store/slice/userSlice';

const MainPage = () => {
  const dispatch = useDispatch();
  const { isAuth, email } = useAuth();

  return isAuth ? (
    <div>
      <h1>email: {email}</h1>
      <h3>you balance: {}</h3>
      <button onClick={() => dispatch(removeUser())}>Log out</button>
    </div>
  ) : (
    <Navigate to='/login' />
  );
};

export default MainPage;

