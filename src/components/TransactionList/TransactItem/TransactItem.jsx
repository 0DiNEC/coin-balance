import React from 'react';

const TransactItem = ({ date, value }) => {
  return (
    <div className='transaction-item'>
      <p>date: {date}</p>
      <h3>
        value: <span className='coin'>{value}</span>
      </h3>
    </div>
  );
};

export default TransactItem;

