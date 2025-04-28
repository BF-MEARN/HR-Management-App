import { useContext } from 'react';
import { createContext } from 'react';

type ErrorMapContextType = {
  updateErrorMap: (key: string, error: string | undefined) => void;
  validateAll: () => boolean;
};

export const ErrorMapContext = createContext<ErrorMapContextType | null>(null);

export default function useErrorMap() {
  const context = useContext(ErrorMapContext);
  if (!context) {
    throw new Error('useErrorMap must be used within an ErrorMapProvider');
  }
  return context;
}
