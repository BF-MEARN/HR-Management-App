import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

import NavBar from './components/NavBar';
import { ProtectedRoute } from './components/ProtectedRoute';
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
import { fetchEmployeeData, setEmployeeStatus } from './store/slices/employeeSlice';
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
    if (userStatus === 'failed') {
      dispatch(setEmployeeStatus('no-user'));
    } else if (userStatus === 'succeeded') {
      dispatch(setEmployeeStatus('idle'));
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
            <Route
              path="onboard"
              element={
                <ProtectedRoute requiredStatus={'onboarding'}>
                  <ErrorMapProvider>
                    <OnboardingApplicationPage />
                  </ErrorMapProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="personal-info"
              element={
                <ProtectedRoute requiredStatus={'onboarded'}>
                  <ErrorMapProvider>
                    <PersonalInformationPage />
                  </ErrorMapProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="visa"
              element={
                <ProtectedRoute requiredStatus={'onboarded'}>
                  <VisaStatusManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="housing"
              element={
                <ProtectedRoute requiredStatus={'onboarded'}>
                  <HousingPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="register/:token" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
