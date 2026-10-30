import React from 'react'
import { AdminContext } from '../../context/AdminContext'
import {useContext,useEffect} from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AllAppointment=()=>{
  const {aToken, appointments,getAllAppointments}=useContext(AdminContext)
  const {slotDateFormat,currency}=useContext(AppContext)
  useEffect(()=>{
   if(aToken){
    getAllAppointments()
   }
  },[aToken])
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll '>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b '>
          <p>#</p>
          <p>patient</p>
          <p>DOB</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {appointments.map((item,index)=>(
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={item.userData?.image} alt={item.userData?.name || 'Patient'} />
              <p>{item.userData?.name || 'Unknown patient'}</p>
            </div>
            <p className='max-sm:hidden'>{item.userData?.dob || '-'}</p>
            <p>{slotDateFormat(item.slotDate)},{item.slotTime}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-gray-200' src={item.docData?.image} alt={item.docData?.name || 'Doctor'} />
              <p>{item.docData?.name || 'Unknown doctor'}</p>
            </div>
            <p>{currency}{item.amount}</p>
            <div className='flex items-center justify-center'>
              <button
                type='button'
                aria-label={item.cancelled ? 'Appointment cancelled' : 'Cancel appointment'}
                className={`flex items-center justify-center h-9 w-9 rounded-full border transition ${item.cancelled ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:bg-red-50'}`}
              >
                <img className='w-4' src={assets.cancel_icon} alt='' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointment