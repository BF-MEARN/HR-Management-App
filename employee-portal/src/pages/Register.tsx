import { Card, Typography } from '@mui/material';

import AuthForm, { AuthFormData } from '../components/AuthForm';

export default function RegisterPage() {
  const handleSubmit = (form: AuthFormData) => {
    console.log(form);
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
      <AuthForm submitButtonText="Register" onSubmit={handleSubmit} includeEmailField={true} />
    </Card>
  );
}
