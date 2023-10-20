import React from 'react';
import { useDispatch } from 'react-redux';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { setUser } from '../store/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import Form from './Form';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '..';
import { setOperations } from '../store/slice/transactSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (email, password) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: user.accessToken,
          }),
        );
      })
      .then(() => {
        const transactionRef = doc(db, 'transact', email);
        runTransaction(db, async (transaction) => {
          const sfDoc = await transaction.get(transactionRef);
          if (sfDoc.exists()) {
            const data = sfDoc.data();
            const operations = data.operations || [];
            dispatch(setOperations(operations));
          }
        });
        navigate('/');
      })
      .catch(() => alert('Invalid user'));
  };

  return (
    <Form
      title={'sign in'}
      handleClick={handleLogin}
    />
  );
};

export default Login;
