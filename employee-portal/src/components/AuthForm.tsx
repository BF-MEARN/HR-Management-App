import React from 'react';

import { Box, Button, FormControl, FormLabel, Stack, TextField } from '@mui/material';

export interface AuthFormData {
  username: string;
  email: string;
  password: string;
}

export interface AuthFormProps {
  type: 'login' | 'registration';
  onSubmit: (form: AuthFormData) => void;
  prefilledEmail?: string;
}

export default function AuthForm(props: AuthFormProps) {
  const { type, prefilledEmail, onSubmit } = props;
  const submitButtonText = type == 'login' ? 'Login' : 'Registration';
  const includeEmailField = type == 'registration';
  const includePasswordConfirmation = type == 'registration';

  const [username, setUserName] = React.useState('');
  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
  const [email, setEmail] = React.useState(prefilledEmail ? prefilledEmail : '');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
  const [passwordConfirmationError, setPasswordConfirmationError] = React.useState(false);
  const [passwordConfirmationErrorMessage, setPasswordConfirmationErrorMessage] =
    React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (usernameError || emailError || passwordError || passwordConfirmationError) {
      return;
    }
    onSubmit({
      username,
      email,
      password,
    });
  };

  const validateInputs = () => {
    let isValid = true;

    if (!username || username.trim().length == 0) {
      setUsernameError(true);
      setUsernameErrorMessage('Please enter a non-empty username.');
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage('');
    }

    if (includeEmailField && (!email || !/\S+@\S+\.\S+/.test(email))) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (includePasswordConfirmation && passwordConfirmation != password) {
      setPasswordConfirmationError(true);
      setPasswordConfirmationErrorMessage('Password does not match.');
      isValid = false;
    } else {
      setPasswordConfirmationError(false);
      setPasswordConfirmationErrorMessage('');
    }

    return isValid;
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Stack gap={2}>
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <TextField
            error={usernameError}
            helperText={usernameErrorMessage}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="username"
            type="text"
            name="username"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={usernameError ? 'error' : 'primary'}
          />
        </FormControl>
        {includeEmailField ? (
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              slotProps={{ input: { readOnly: prefilledEmail !== undefined } }}
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? 'error' : 'primary'}
            />
          </FormControl>
        ) : null}
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={passwordError ? 'error' : 'primary'}
          />
        </FormControl>
        {includePasswordConfirmation && (
          <FormControl>
            <FormLabel htmlFor="password-confirmation">Password Confirmation</FormLabel>
            <TextField
              error={passwordConfirmationError}
              helperText={passwordConfirmationErrorMessage}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              name="password-confirmation"
              placeholder="••••••"
              type="password"
              id="password-confirmation"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
        )}
        <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
          {submitButtonText}
        </Button>
      </Stack>
    </Box>
  );
}
