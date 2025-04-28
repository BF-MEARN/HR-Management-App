import { ReactNode, useRef } from 'react';

import { ErrorMapContext } from './useErrorMap';

const ErrorMapProvider = ({ children }: { children: ReactNode }) => {
  const errorMap = useRef<Record<string, string | undefined>>({});

  const validateAll = () => Object.values(errorMap.current).every((error) => error === undefined);

  const updateErrorMap = (key: string, error: string | undefined) => {
    errorMap.current[key] = error;
  };

  return (
    <ErrorMapContext.Provider value={{ updateErrorMap, validateAll }}>
      {children}
    </ErrorMapContext.Provider>
  );
};

export default ErrorMapProvider;
