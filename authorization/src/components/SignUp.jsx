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
import { Context, db } from '..';
import { arrayUnion, doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
  const { app } = useContext(Context);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegistration = (email, password, isAdmin) => {
    const auth = getAuth();
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(
        '6LeadLYoAAAAACA9PnNkQS1SLuYXORKwJA5mkvFB',
      ),
    });
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
