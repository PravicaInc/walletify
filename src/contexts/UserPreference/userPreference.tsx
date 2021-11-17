import React, { FC } from 'react';
import { useUserPreference } from './useUserPreference';
import { UserPreferenceContext } from './userPreferenceContext';

const UserPreference: FC = ({ children }) => {
  const userPreference = useUserPreference();
  return (
    <UserPreferenceContext.Provider value={userPreference}>
      {children}
    </UserPreferenceContext.Provider>
  );
};

export default UserPreference;
