import { UseSelector, useSelector } from 'react-redux';

export function useAuth() {
  const {email, token, id, balance} = useSelector((state) => state.user);
  return {
    isAuth: !!email,
    email,
    token,
    id,
    balance,
  }
}
