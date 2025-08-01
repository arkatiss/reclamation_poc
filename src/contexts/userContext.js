import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState("user"); 

  return (
    <UserContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);