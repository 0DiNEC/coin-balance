import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../../store/slice/userSlice';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../..';
import {
  removeOperations,
  addOperation,
  setOperations,
} from '../../store/slice/transactSlice';
import TransactList from '../../components/TransactionList/TransactList';
import { DAILY_COINS, DAY, HOURS, MINUTES } from '../../helpers/constValues';
import { getFormattedDate } from '../../helpers/dateFormatted';

const UserPage = ({ isAuth, email }) => {
  const dispatch = useDispatch();
  const operations = useSelector((state) => state.transact.operations);

  const [balance, setBalance] = useState(null);
  const [nextDailyBonusTime, setNextDailyBonusTime] = useState('');

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
          if (timeDifference >= DAY) {
            updatedBalance += DAILY_COINS;
            const currentServerTime = Timestamp.now();
            const formattedDateTime = getFormattedDate(
              currentServerTime.toDate(),
            );

            await runTransaction(db, async (transaction) => {
              const sfDoc = await transaction.get(transactionRef);
              const data = sfDoc.data();
              
              const operations = data.operations || [];
              operations.push({
                amount: DAILY_COINS,
                timestamp: formattedDateTime,
              });

              dispatch(
                addOperation({
                  amount: DAILY_COINS,
                  timestamp: formattedDateTime,
                }),
              );
              console.log('set');
              transaction.set(transactionRef, { operations });
            });

            await updateDoc(balanceDocRef, {
              count: updatedBalance,
              lastUpdated: currentServerTime,
            });
          }

          setBalance(updatedBalance);
        } else {
          const currentTime = Timestamp.now();
          const operations = [
            {
              amount: DAILY_COINS,
              timestamp: getFormattedDate(currentTime.toDate()),
            },
          ];

          await setDoc(balanceDocRef, {
            count: DAILY_COINS,
            lastUpdated: currentTime,
          });

          await setDoc(transactionRef, {
            operations,
          });

          dispatch(setOperations(operations));
          setBalance(DAILY_COINS);
        }
      };

      const intervalId = setInterval(updateBalance, 5000);
      updateBalance();
      
      return () => clearInterval(intervalId);
    }
  }, [dispatch, email, isAuth]);

  return (
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
  );
};

export default UserPage;

