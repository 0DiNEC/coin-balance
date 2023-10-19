import React from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slice/userSlice';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Form from './Form';

const Login = () => {
  const dispatch = useDispatch();
  const handleLogin = (email, password) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(({user}) => {
        dispatch(setUser({
          email: user.email,
          id: user.id,
          token: user.accessToken
        }))
      })
      .catch(console.error);
  };
  return (
    <Form
      title={'sign in'}
      handleClick={handleLogin}
    />
  );
};

export default Login;

