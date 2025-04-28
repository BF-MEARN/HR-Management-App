import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

import { Backdrop, CircularProgress } from '@mui/material';

import NavBar from './components/NavBar';
import ErrorMapProvider from './hooks/error-map/ErrorMapProvider';
import HousingPage from './pages/Housing';
import LoginPage from './pages/Login';
import NotFound from './pages/NotFound';
import OnboardingApplicationPage from './pages/OnboardingApplication';
import PersonalInformationPage from './pages/PersonalInformation';
import RegisterPage from './pages/Register';
import VisaStatusManagementPage from './pages/VisaStatusManagement';
import { useAppDispatch, useAppSelector } from './store';
import { updateFormsWithEmployee } from './store/slices/employeeFormSlice';
import { fetchEmployeeData } from './store/slices/employeeSlice';
import { fetchMe } from './store/slices/userSlice';

function App() {
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector((state) => state.user.status);
  const employeeStatus = useAppSelector((state) => state.employee.status);
  const employee = useAppSelector((state) => state.employee.employee);

  const [backdropOpen, setBackdropOpen] = useState(true);

  useEffect(() => {
    if (userStatus === 'pending' || employeeStatus === 'pending') {
      setBackdropOpen(true);
    } else {
      setBackdropOpen(false);
    }
  }, [userStatus, dispatch, employeeStatus]);

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
      <Backdrop open={backdropOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <BrowserRouter>
        <Routes>
          <Route element={<NavBar />}>
            <Route index element={<LoginPage />} />
            <Route
              path="onboard"
              element={
                <ErrorMapProvider>
                  <OnboardingApplicationPage />
                </ErrorMapProvider>
              }
            />
            <Route
              path="personal-info"
              element={
                <ErrorMapProvider>
                  <PersonalInformationPage />
                </ErrorMapProvider>
              }
            />
            <Route path="visa" element={<VisaStatusManagementPage />} />
            <Route path="housing" element={<HousingPage />} />
          </Route>
          <Route path="register/:token" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
