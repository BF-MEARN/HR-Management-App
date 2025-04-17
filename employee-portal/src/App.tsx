import { BrowserRouter, Routes, Route } from 'react-router';
import NavBar from './components/NavBar';
import Home from './pages/Home';

function App() {
  return (
    <>
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route>
            <Route path="login" element={<>Login!</>} />
            <Route path="register" element={<>Register!</>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
