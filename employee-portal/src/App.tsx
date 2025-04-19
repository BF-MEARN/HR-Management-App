import { BrowserRouter, Route, Routes } from 'react-router';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import OnboardingApplicationPage from './pages/OnboardingApplication';
import RegisterPage from './pages/Register';
import HousingPage from './pages/housing_without_backend/Housing';

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
            <Route path="housing" element={<HousingPage />} />
          </Route>
          <Route>
            <Route path="onboard" element={<OnboardingApplicationPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
