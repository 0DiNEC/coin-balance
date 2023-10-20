import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { setUser } from '../store/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import Form from './Form';
import { Context } from '..';

const SignUp = () => {
  const {app} = useContext(Context);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegistration = (email, password) => {
    const auth = getAuth();
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider('6LeadLYoAAAAACA9PnNkQS1SLuYXORKwJA5mkvFB'),
    });
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: user.accessToken,
          }),
        );
        navigate('/');
      })
      .catch(console.error);
  };
  return (
    <Form
      title={'Create account'}
      handleClick={handleRegistration}
    />
  );
};

export default SignUp;

