import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../components/Login';

const LoginPage = () => {
  return (
    <div className='login'>
      <h1>Login</h1>
      <Login />
      <p>
        Haven't registered yet? <Link to='/register'>Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;

