import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';

import { Backdrop, CircularProgress } from '@mui/material';

import { useAppSelector } from '../store';

export function ProtectedRoute({
  requiredStatus,
  children,
}: {
  requiredStatus: 'onboarding' | 'onboarded';
  children: JSX.Element;
}) {
  const user = useAppSelector((state) => state.user);
  const employee = useAppSelector((state) => state.employee);

  const isNotLoggedIn = user.status === 'failed';
  const isOnboarding =
    employee.status === 'no-user' || employee.employee?.onboardingStatus !== 'Approved';

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (
      user.status === 'idle' ||
      user.status === 'pending' ||
      employee.status === 'idle' ||
      employee.status === 'pending'
    ) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [user, employee]);

  if (isNotLoggedIn) {
    return <Navigate to={'/'} replace />;
  }
  if (!loading && isOnboarding && requiredStatus != 'onboarding') {
    return <Navigate to={'/onboard'} replace />;
  }

  if (!loading && !isOnboarding && requiredStatus != 'onboarded') {
    return <Navigate to={'/personal-info'} replace />;
  }

  return (
    <>
      {children}
      {loading && (
        <>
          <Backdrop open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      )}
      ;
    </>
  );
}
