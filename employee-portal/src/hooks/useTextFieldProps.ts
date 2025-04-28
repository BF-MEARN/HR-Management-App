import { useEffect, useMemo, useState } from 'react';

import { TextFieldProps } from '@mui/material';
import validator from 'validator';

type ValidateType = 'email' | 'date' | 'phone' | 'ssn';

export type FormField<T> = {
  name: string;
  get: () => T;
  set: (v: T) => void;
  extraValidate?: (value: T) => string | undefined;
  required: boolean | (() => boolean);
  readOnly: boolean;
  type?: ValidateType;
};

export type StringFormField = FormField<string>;

function validate(
  value: string,
  { extraValidate, required, type }: StringFormField
): string | undefined {
  const requiredValue = typeof required === 'function' ? required() : required;
  const isEmpty = validator.isEmpty(value.trim());
  if (requiredValue && isEmpty) {
    return 'This field is required.';
  }

  switch (type) {
    case 'email':
      if (!isEmpty && !validator.isEmail(value)) return 'Invalid email address.';
      break;
    case 'date':
      if (!isEmpty && !validator.isDate(value)) return 'Invalid date format.';
      break;
    case 'phone':
      if (!isEmpty && !validator.isMobilePhone(value, 'en-US')) return 'Invalid phone number.';
      break;
    case 'ssn':
      if (!isEmpty && !/^\d{3}-\d{2}-\d{4}$/.test(value))
        return 'SSN must be in ###-##-#### format.';
      break;
    default:
      break;
  }

  return extraValidate ? extraValidate(value) : undefined;
}

export function useTextFieldProps(
  field: StringFormField,
  forceCheck: boolean = false,
  updateErrorMap?: (key: string, error: string | undefined) => void
): TextFieldProps {
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState<boolean>(forceCheck);
  const { name, get, set, required, readOnly } = field;

  useEffect(() => {
    const newError = validate(get(), field);
    setError(newError);
    if (updateErrorMap) {
      updateErrorMap(name, newError);
    }
    if (forceCheck) {
      setTouched(forceCheck);
    }

    return () => {
      if (updateErrorMap) {
        updateErrorMap(name, undefined);
      }
    };
  }, [field, forceCheck, get, name, updateErrorMap]);

  const props = useMemo(() => {
    const requiredValue = typeof required === 'function' ? required() : required;
    return {
      fullWidth: true,
      name,
      value: get(),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setTouched(true);
        set(e.target.value);
        const error = validate(e.target.value, field);
        setError(error);
        if (updateErrorMap) {
          updateErrorMap(name, error);
        }
      },
      error: touched ? !!error : undefined,
      helperText: touched ? error : undefined,
      required: requiredValue,
      slotProps: {
        input: { disabled: readOnly },
      },
    };
  }, [error, field, get, name, readOnly, required, set, touched, updateErrorMap]);

  return props;
}
