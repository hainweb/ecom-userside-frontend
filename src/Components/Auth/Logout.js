import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {BASE_URL} from '../Urls/Urls';

const Logout = ({ setUser, setCartCount }) => {
  const navigate = useNavigate();

  useEffect(() => {
    
    axios.get(`${BASE_URL}/logout`, { withCredentials: true })
      .then((response) => {
        console.log('Logged out successfully');
        setUser(null);       
        setCartCount(0);      
        navigate('/');       
      })
      .catch((error) => {
        console.error('Logout failed', error);
      });
  }, [setUser, setCartCount, navigate]);

  return null; 
};

export default Logout;
