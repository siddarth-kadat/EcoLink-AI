import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const { user } = useAuth();
  
  const isRestaurant = () => user?.role.toLowerCase() === 'restaurant';
  const isNGO = () => user?.role.toLowerCase() === 'ngo';
  const isVolunteer = () => user?.role.toLowerCase() === 'volunteer';
  const isAdmin = () => user?.role.toLowerCase() === 'admin';
  
  return (
    <RoleContext.Provider value={{ isRestaurant, isNGO, isVolunteer, isAdmin, currentRole: user?.role }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
