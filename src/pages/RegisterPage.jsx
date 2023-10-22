import React from 'react';
import { Link } from 'react-router-dom';
import SignUp from '../components/SignUp';

const RegisterPage = () => {
  return (
    <div className='registration'>
      <h1>Register</h1>
      <SignUp />
      <p>
        Already registered?{' '}
        <Link
          to='/login'
          className='link'>
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

