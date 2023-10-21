import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../../store/slice/userSlice';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../..';
import {
  removeOperations,
  addOperation,
} from '../../store/slice/transactSlice';
import TransactList from '../../components/TransactionList/TransactList';
import './MainPage.css';

const MainPage = () => {
  const dispatch = useDispatch();
  const operations = useSelector((state) => state.transact.operations);

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
          if (timeDifference >= 10000) {
            updatedBalance += dailyCoinValue;
            const currentServerTime = Timestamp.now();
            const serverTimeDate = currentServerTime.toDate();
            const formattedDateTime = serverTimeDate.toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              fractionalSecondDigits: 3,
            });

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
                timestamp: formattedDateTime,
              });
              dispatch(
                addOperation({
                  amount: dailyCoinValue,
                  timestamp: formattedDateTime,
                }),
              );
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
  }, [isAuth, email, id, HOURS, MINUTES, DAY, dispatch]);

  return isAuth ? (
    <div className='main'>
      <div className='main-info'>
        <h1 className='info__title'>
          Next bonus after:{' '}
          <span className='title-time'>{nextDailyBonusTime}</span>
        </h1>
        <h3 className='info-account__email'>EMAIL: {email}</h3>
        <h3 className='info-account__balance'>
          BALANCE: <span className='coin'>{balance}</span>
        </h3>
        <button
          className='log-out'
          onClick={() => {
            dispatch(removeUser());
            dispatch(removeOperations());
          }}>
          Log out
        </button>
      </div>
      <TransactList operations={operations} />
    </div>
  ) : (
    <Navigate to='/login' />
  );
};

export default MainPage;
