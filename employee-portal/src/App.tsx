import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

import NavBar from './components/NavBar';
import LoginPage from './pages/Login';
import OnboardingApplicationPage from './pages/OnboardingApplication';
import RegisterPage from './pages/Register';
import HousingPage from './pages/housing_without_backend/Housing';
import { useAppDispatch, useAppSelector } from './store';
import { updateFormsWithEmployee } from './store/slices/employeeFormSlice';
import { fetchEmployeeData } from './store/slices/employeeSlice';
import { fetchMe } from './store/slices/userSlice';

function App() {
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector((state) => state.user.status);
  const employeeStatus = useAppSelector((state) => state.employee.status);
  const employee = useAppSelector((state) => state.employee.employee);
  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchMe());
    }
  }, [userStatus, dispatch]);

  useEffect(() => {
    if (userStatus === 'succeeded' && employeeStatus === 'idle') {
      dispatch(fetchEmployeeData());
    }
  }, [userStatus, dispatch, employeeStatus]);

  useEffect(() => {
    if (employeeStatus === 'succeeded' && employee) {
      dispatch(updateFormsWithEmployee(employee));
    }
  }, [userStatus, dispatch, employeeStatus, employee]);
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
