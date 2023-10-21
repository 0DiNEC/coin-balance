import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check';
import { setUser } from '../store/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import Form from './Form';
import { db } from '..';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegistration = (email, password, isAdmin) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        const adminsRef = doc(db, 'accounts', email);
        await setDoc(adminsRef, {
          id: user.uid,
          email: user.email,
          isAdmin: isAdmin,
        });
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: user.accessToken,
            isAdmin: isAdmin,
          }),
        );
        navigate('/');
      })
      .catch((err) => alert(err.message));
  };
  return (
    <Form
      title={'Create account'}
      handleClick={handleRegistration}
      isCheckBox={true}
    />
  );
};

export default SignUp;
