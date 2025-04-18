import { BrowserRouter, Routes, Route } from 'react-router';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

function App() {
  return (
    <>
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
