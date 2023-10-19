import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className='registration'>
      <h1>Register</h1>  
      <p>
        Already registered? <Link to='/login'>Log in</Link>
      </p>
    </div>
  );
};

export default RegisterPage;

