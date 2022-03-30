import React, { FC, useState } from 'react';
import { useUserPreference } from './useUserPreference';
import { UserPreferenceContext } from './userPreferenceContext';

const UserPreference: FC = ({ children }) => {
  const userPreference = useUserPreference();
  const [stxPrice, setStxPrice] = useState<number>(0);
  return (
    <UserPreferenceContext.Provider
      value={{ ...userPreference, stxPrice, setStxPrice }}>
      {children}
    </UserPreferenceContext.Provider>
  );
};

export default UserPreference;
