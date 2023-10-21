import React, { useState } from 'react';
import './Form.css';

const Form = ({ title, handleClick, isCheckBox }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClick(email, password, isAdmin);
  };

  return (
    <form
      className='form'
      onSubmit={handleSubmit}>
      <input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='email'
        autoComplete='email'
      />
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='password'
        autoComplete='current-password'
      />
      {isCheckBox && (
        <div>
          <input
            id='admin_check'
            type='checkbox'
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
          />
          <label htmlFor='admin_check'>make admin</label>
        </div>
      )}
      <button type='submit'>{title}</button>
    </form>
  );
};

export default Form;
