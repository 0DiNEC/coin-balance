import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeUser } from '../../store/slice/userSlice';
import { db } from '../..';
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  runTransaction,
  updateDoc,
} from 'firebase/firestore';
import { getFormattedDate } from '../../helpers/dateFormatted';
import './AdminPage.css';

const AdminPage = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const adminBonusCoin = 100;

  const AddCoins = async (email, balance) => {
    const balanceDocRef = doc(db, 'balance', email);
    const transactionRef = doc(db, 'transact', email);

    runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(transactionRef);
      const data = sfDoc.data();
      const operations = data.operations || [];
      operations.push({
        amount: adminBonusCoin,
        timestamp: getFormattedDate(Timestamp.now().toDate()),
      });
      transaction.set(transactionRef, { operations });
    });

    await updateDoc(balanceDocRef, {
      count: balance + adminBonusCoin,
    });
  };

  const SubCoins = async (email, balance) => {
    const balanceDocRef = doc(db, 'balance', email);
    const transactionRef = doc(db, 'transact', email);

    runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(transactionRef);
      const data = sfDoc.data();
      const operations = data.operations || [];
      operations.push({
        amount: -adminBonusCoin,
        timestamp: getFormattedDate(Timestamp.now().toDate()),
      });
      transaction.set(transactionRef, { operations });
    });

    await updateDoc(balanceDocRef, {
      count: balance - adminBonusCoin,
    });
  };

  useEffect(() => {
    const getUsers = async () => {
      const balanceDocRef = collection(db, 'balance');
      const queryUsers = await getDocs(balanceDocRef);
      const usersData = [];
      queryUsers.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          email: doc.id, // email
          balance: data.count,
        });
      });
      setUsers(usersData);
    };
    getUsers();
  });

  return (
    <div className='admin-page'>
      <ul className='users-list'>
        {users.map((user, index) => (
          <li
            key={index}
            className='list-item'>
            <div className='list-item__account-info'>
              <h2 className='account-info__email'>User: {user.email}</h2>
              <h3 className='account-info__balance'>
                {' '}
                Balance: <span className='coin'>{user.balance}</span>
              </h3>
            </div>
            <div className='list-item__buttons'>
              <button
                className='btn-sub-coin'
                onClick={() => SubCoins(user.email, user.balance)}>
                SUB 100 COIN
              </button>
              <button
                className='btn-add-coin'
                onClick={() => AddCoins(user.email, user.balance)}>
                ADD 100 COIN
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        className='log-out'
        onClick={() => {
          dispatch(removeUser());
        }}>
        Log out
      </button>
    </div>
  );
};

export default AdminPage;

