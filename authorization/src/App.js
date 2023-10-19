import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<MainPage />}
        />
        <Route
          path='/login'
          element={<LoginPage />}
        />
        <Route
          path='/register'
          element={<RegisterPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

