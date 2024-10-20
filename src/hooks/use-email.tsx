import { useContext } from 'react';
import { EmailContext } from '../context/EmailContext';

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};
