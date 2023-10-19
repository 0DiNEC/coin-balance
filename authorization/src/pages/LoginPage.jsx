import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className='login'>
      <h1>Login</h1>
      <p>
        Haven't registered yet? <Link to='/register'>Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
