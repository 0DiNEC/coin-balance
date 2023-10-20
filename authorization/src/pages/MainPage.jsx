import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { useDispatch } from 'react-redux';
import { removeUser } from '../store/slice/userSlice';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
  runTransaction,
  Firestore,
  Timestamp,
} from 'firebase/firestore';
import { db } from '..';

const MainPage = () => {
  const dispatch = useDispatch();
  const { isAuth, email, id } = useAuth();
  const [balance, setBalance] = useState(null);
  const [nextDailyBonusTime, setNextDailyBonusTime] = useState('');
  const MINUTES = 60 * 1000;
  const HOURS = 60 * MINUTES;
  const DAY = 24 * HOURS;

  const dailyCoinValue = 1000;

  useEffect(() => {
    if (isAuth) {
      const updateBalance = async () => {
        const balanceDocRef = doc(db, 'balance', email);
        const transactionRef = doc(db, 'transact', email);

        const balanceDoc = await getDoc(balanceDocRef);

        if (balanceDoc.exists()) {
          const currentBalance = balanceDoc.data().count;
          const lastUpdated = balanceDoc.data().lastUpdated;
          const currentTime = Timestamp.now();

          const timeDifference =
            currentTime.toMillis() - lastUpdated.toMillis();

          const remainingHours = Math.floor(24 - timeDifference / HOURS);
          const remainingMinutes = Math.floor(
            60 - (timeDifference % HOURS) / MINUTES,
          );

          setNextDailyBonusTime(
            `${remainingHours !== 0 ? `${remainingHours} h ` : ''}  ${
              remainingMinutes !== 0 ? `${remainingMinutes} min` : ''
            }`,
          );

          let updatedBalance = currentBalance;
          if (timeDifference >= 5000) {
            updatedBalance += dailyCoinValue;
            const currentServerTime = Timestamp.now();

            await runTransaction(db, async (transaction) => {
              const sfDoc = await transaction.get(transactionRef);
              if (!sfDoc.exists()) {
                await setDoc(transactionRef, {
                  operation: [],
                });
              }
              const data = sfDoc.data();
              const operations = data.operations || [];
              operations.push({
                amount: dailyCoinValue,
                timestamp: currentServerTime,
              });
              transaction.set(transactionRef, { operations });
            });

            await updateDoc(balanceDocRef, {
              count: updatedBalance,
              lastUpdated: currentServerTime,
            });
          }

          setBalance(updatedBalance);
        } else {
          const currentTime = serverTimestamp();

          await setDoc(balanceDocRef, {
            count: dailyCoinValue,
            lastUpdated: currentTime,
          });

          setBalance(dailyCoinValue);
        }
      };

      const intervalId = setInterval(updateBalance, 5000);

      updateBalance();

      return () => clearInterval(intervalId);
    }
  }, [isAuth, email, id, HOURS, MINUTES, DAY]);

  return isAuth ? (
    <div>
      <h1>Next bonus after: {nextDailyBonusTime}</h1>
      <h3>email: {email}</h3>
      <h3>you balance: {balance}</h3>
      <button onClick={() => dispatch(removeUser())}>Log out</button>
    </div>
  ) : (
    <Navigate to='/login' />
  );
};

export default MainPage;
