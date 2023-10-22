import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { useDispatch } from 'react-redux';
import { removeUser } from '../store/slice/userSlice';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '..';

const MainPage = () => {
  const dispatch = useDispatch();
  const { isAuth, email } = useAuth();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (isAuth) {
      const updateBalance = async () => {
        const balanceDoc = await getDoc(doc(db, 'balance', email));
        if (balanceDoc.exists()) {
          const currentBalance = balanceDoc.data().count;
          const lastUpdated = balanceDoc.data().lastUpdated;
          const timeRef = doc(db, 'time', 'TIMESTAMP');

          await setDoc(timeRef, {
            time: serverTimestamp(),
          });
          const currentTime = (await getDoc(timeRef)).data().time;

          const timeDifference = currentTime.toMillis() - lastUpdated.toMillis();

          if (timeDifference >= 24 * 60 * 60 * 1000) {
            const newBalance = currentBalance + 1000;

            await setDoc(doc(db, 'balance', email), {
              count: newBalance,
              lastUpdated: serverTimestamp(),
            });

            setBalance(newBalance);
          }
        } else {
          await setDoc(doc(db, 'balance', email), {
            count: 1000,
            lastUpdated: serverTimestamp(),
          });
        }
      };

      const intervalId = setInterval(updateBalance, 5000);

      updateBalance();

      return () => clearInterval(intervalId);
    }
  }, [isAuth, email]);

  return isAuth ? (
    <div>
      <h1>email: {email}</h1>
      <h3>you balance: {balance}</h3>
      <button onClick={() => dispatch(removeUser())}>Log out</button>
    </div>
  ) : (
    <Navigate to='/login' />
  );
};

export default MainPage;
