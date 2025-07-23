import { Navigate } from 'react-router-dom';
const checkUserExists = ({ element,redirectTo  }) => {

    const isLoggedIn = !!sessionStorage.getItem('userData');
    if (!isLoggedIn && redirectTo === '/login') {
      return element; 
    }
  
    if (isLoggedIn && redirectTo === '/login') {
      return <Navigate to="/home" replace />;
    }
  
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
  
    return element; 
};
export default checkUserExists;