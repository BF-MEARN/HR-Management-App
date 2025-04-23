import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

import NavBar from './components/NavBar';
import LoginPage from './pages/Login';
import OnboardingApplicationPage from './pages/OnboardingApplication';
import RegisterPage from './pages/Register';
import HousingPage from './pages/housing_without_backend/Housing';
import { useAppDispatch, useAppSelector } from './store';
import { fetchMe } from './store/slices/userSlice';

function App() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.user.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMe());
    }
  }, [status, dispatch]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<NavBar />}>
            <Route index element={<LoginPage />} />
            <Route path="onboard" element={<OnboardingApplicationPage />} />
            <Route path="personal-info" element="Under construction!" />
            <Route path="visa" element="Under construction!" />
            <Route path="housing" element={<HousingPage />} />
          </Route>
          <Route path="register/:token" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
