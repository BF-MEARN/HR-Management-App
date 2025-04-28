import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { Alert, Box, Card, Typography } from '@mui/material';

import AuthForm, { AuthFormData } from '../components/AuthForm';
import { useAppDispatch, useAppSelector } from '../store';
import { setUser } from '../store/slices/userSlice';
import { api } from '../utils/utils';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const employeeOnboardingStatus = useAppSelector(
    (state) => state.employee.employee?.onboardingStatus
  );

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (user) {
      if (employeeOnboardingStatus === 'Approved') {
        navigate('/personal-info');
      } else {
        navigate('/onboard');
      }
    }
  }, [employeeOnboardingStatus, navigate, user]);

  useEffect(() => {
    if (toastOpen) {
      const timer = setTimeout(() => {
        setToastOpen(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toastOpen]);

  const handleSubmit = async (form: AuthFormData) => {
    const res = await api('/user/login', {
      method: 'post',
      body: JSON.stringify({ username: form.username, password: form.password }),
    });

    if (res.ok) {
      const { user } = await res.json();

      if (user.role !== 'employee') {
        setToastMessage('Access Denied: Only employees can login.');
        setToastOpen(true);
        return;
      }

      dispatch(setUser(user));
      navigate('/');
    } else {
      setToastMessage('Login failed. Please check your credentials.');
      setToastOpen(true);
    }
  };

  return (
    <Box
      minHeight="100vh"
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      {/* Floating Toast */}
      {toastOpen && (
        <Box
          position="absolute"
          top="32px"
          left="50%"
          sx={{
            transform: 'translateX(-50%)',
            zIndex: 9999,
          }}
        >
          <Alert severity="error" onClose={() => setToastOpen(false)}>
            {toastMessage}
          </Alert>
        </Box>
      )}

      {/* Login Card */}
      <Card
        variant="outlined"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          padding: '2rem',
          gap: '1rem',
          maxWidth: '450px',
        }}
      >
        <Typography component="h1" variant="h4" fontWeight="bold">
          Log in
        </Typography>
        <AuthForm type="login" onSubmit={handleSubmit} />
      </Card>
    </Box>
  );
}
