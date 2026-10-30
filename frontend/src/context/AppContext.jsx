import { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { AppContext } from './AppContext.js';

const AppContextProvider = (props) => {
  const currencySymbol = '$';
  const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '');
  const [doctors, setDoctors] = useState([]);
  const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
  const [userData,setUserData]=useState(false)
  const [isUserProfileLoading,setIsUserProfileLoading]=useState(false)

  const getDoctorsData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list');
      if (data.success) {
        setDoctors(data.doctors || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl]);

  useEffect(() => {
    void Promise.resolve().then(getDoctorsData);
  }, [getDoctorsData]);

  const loadUserProfileData=useCallback(async()=>{
    if (!token) {
      setUserData(false)
      setIsUserProfileLoading(false)
      return
    }

    setIsUserProfileLoading(true)
    try{
     const {data}=await axios.get(backendUrl+'/api/user/get-profile',{headers:{token}})
     if(data.success && data.userData){
      setUserData(data.userData)
     }else{
      setUserData(false)
      toast.error(data.message || 'Unable to load your profile.')
     }
    }catch(error){
      console.log(error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        setToken(false)
        setUserData(false)
        toast.warn('Your session has expired. Please log in again.')
      } else {
        toast.error(error.response?.data?.message || error.message)
      }
    } finally {
      setIsUserProfileLoading(false)
    }
  }, [backendUrl, token])
  const value = {
    doctors,getDoctorsData,
    currencySymbol,
    backendUrl,
    token,setToken,
    userData,setUserData,
    loadUserProfileData,
    isUserProfileLoading
  };
  useEffect(()=>{
    void Promise.resolve().then(loadUserProfileData)
  },[loadUserProfileData])

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;