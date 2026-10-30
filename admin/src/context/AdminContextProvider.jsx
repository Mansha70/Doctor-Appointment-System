import { useState } from 'react';
import { AdminContext } from './AdminContext';
import axios from 'axios';
import {toast} from 'react-toastify'

export const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):"");
  const [doctorList,setDoctorList]=useState([]);
  const [appointments,setAppointments]=useState([])
  const [dashData,setDashData]=useState(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '');

  const getAllDoctors=async()=>{
    try{
    const {data}=await axios.get(backendUrl+'/api/admin/all-doctors',{headers:{atoken:aToken}})
     if(data.success){
      setDoctorList(data.doctors)
     }else{
      toast.error(data.message)
     }
    }catch(error){
      toast.error(error.message)
    }
  }
  const changeAvailability=async(docId)=>{
     try{
      const {data}=await axios.post(backendUrl+'/api/admin/change-availability',{docId},{headers:{atoken:aToken}})
       if(data.success){
        toast.success(data.message)
        getAllDoctors()
       }else{
        toast.error(data.message)
       }
     }catch(error){
      toast.error(error.message)
     }
  }

  const getAllAppointments=async()=>{
    try{
     const {data}=await axios.get(backendUrl+'/api/admin/appointments',{headers:{aToken}})
   if(data.success){
    console.log(data) 
    setAppointments(data.appointments)
   }else{
    toast.error(data.message)
   }
    }catch(error){
      toast.error(error.message)
    }
  }


  const cancelAppointment=async(appointmentId)=>{
    try{
     const {data}=await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}})
     if(data.success){
       toast.success(data.message)
       getAllAppointments()
     }else{
      toast.error(data.message)
     }
    }catch(error){
     toast.error(error.message)
    }
  }
  const getDashData=async()=>{
    try{
    const {data}=await axios.get(backendUrl+'/api/admin/dashboard',{headers:{aToken}})
    if(data.success){
      setDashData(data.dashData)
      console.log(data)
    }else{
      toast.error(data.message)
    }
    }catch(error){
      toast.error(error.message)
    }
  }


  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctorList,
    getAllDoctors,
    changeAvailability,
    getAllAppointments,
    appointments,
    setAppointments,
    cancelAppointment,
    getDashData,
    dashData
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
