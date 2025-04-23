import React from 'react';
import { useNavigate, useParams } from 'react-router';

import { Card, Typography } from '@mui/material';

import AuthForm, { AuthFormData } from '../components/AuthForm';
import { api } from '../utils/utils';

interface RegistrationToken {
  token: string;
  email: string;
  used: boolean;
}

export default function RegisterPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [regToken, setRegToken] = React.useState<null | RegistrationToken>(null);

  React.useEffect(() => {
    const checkRegToken = async () => {
      const tokenId = params['token'];
      if (!tokenId) return;
      const res = await api(`/onboarding/registration-token/${tokenId}`);
      const { token } = await res.json();
      if (!token.used) setRegToken(token);
    };
    checkRegToken();
  }, [params]);

  const handleSubmit = async (form: AuthFormData) => {
    const res = await api('/user/register', {
      method: 'post',
      body: JSON.stringify({
        username: form.username,
        email: form.email,
        password: form.password,
        tokenUUID: regToken?.token,
      }),
    });
    if (res.ok) {
      navigate('/');
    } else {
      console.log(await res.json());
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
      <Typography component="h1" variant="h4">
        Register
      </Typography>
      {regToken ? (
        <AuthForm type="registration" onSubmit={handleSubmit} prefilledEmail={regToken.email} />
      ) : (
        <Typography variant="body1">Registration Link is not valid. Please email HR.</Typography>
      )}
    </Card>
  );
}
