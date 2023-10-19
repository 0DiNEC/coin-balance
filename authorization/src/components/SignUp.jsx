import React from 'react';
import { useDispatch } from 'react-redux';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Form from './Form';

const SignUp = () => {
  const dispatch = useDispatch();
  const handleRegistration = (email, password) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(console.log)
      .catch(console.error);
  };
  return <Form title={'Create account'} handleClick={handleRegistration}/>;
};

export default SignUp;

