import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { Card, Typography } from '@mui/material';

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

  useEffect(() => {
    if (user) {
      if (employeeOnboardingStatus === 'Approved') {
        navigate('/personal-info');
      } else {
        navigate('/onboard');
      }
    }
  }, [employeeOnboardingStatus, navigate, user]);

  const handleSubmit = async (form: AuthFormData) => {
    const res = await api('/user/login', {
      method: 'post',
      body: JSON.stringify({ username: form.username, password: form.password }),
    });
    if (res.ok) {
      const { user } = await res.json();
      dispatch(setUser(user));
      navigate('/onboard');
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '100%',
        padding: '2rem',
        gap: '1rem',
        marginBlock: '10rem',
        marginInline: 'auto',
        maxWidth: '450px',
      }}
    >
      <Typography component="h1" variant="h4" fontWeight={'bold'}>
        Log in
      </Typography>
      <AuthForm type="login" onSubmit={handleSubmit} />
    </Card>
  );
}
