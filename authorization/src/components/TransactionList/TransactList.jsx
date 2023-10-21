import React from 'react';
import TransactItem from './TransactItem/TransactItem';
import './TransactList.css';

const TransactList = ({ operations }) => {
  const reversedOperations = [...operations].reverse();
  return (
    <div className='transaction-block'>
      <h1 className='title'>Transactions</h1>
      {reversedOperations.map((operation, index) => (
        <TransactItem
          key={index}
          date={operation.timestamp}
          value={operation.amount}
        />
      ))}
    </div>
  );
};

export default TransactList;

