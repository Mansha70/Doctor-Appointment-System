
import React, { useContext, useState, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
const DoctorProfile = () => {

  const {
    dToken,
    profileData,
    setProfileData,
    getProfileData,backendUrl
  } = useContext(DoctorContext);

  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const updateProfile=async()=>{
    try{
   const updateData={
    address:profileData.address,
    fees:profileData.fees,
    available:profileData.available
   }
   const {data}=await axios.post(backendUrl +'/api/doctor/update-profile',updateData,{headers:{dToken}})
   if(data.success){
    toast.success(data.message) 
    setIsEdit(false)
      getProfileData()
    
   }else{
    toast.error(data.message)
   }
    }catch(error){
       toast.error(error.message)
    }
  }

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  if (!profileData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className='flex flex-col gap-5 m-5'>

        {/* Doctor Image */}
        <div>
          <img
            className='bg-primary/80 w-full sm:max-w-64 rounded-lg'
            src={profileData.image}
            alt=""
          />
        </div>

        <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>

          {/* Basic Information */}
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
            {profileData.name}
          </p>

          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>
              {profileData.degree} - {profileData.speciality}
            </p>

            <button className='py-0.5 px-2 border text-xs rounded-full'>
              {profileData.experience}
            </button>
          </div>

          {/* About */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>
              About:
            </p>

            <p className='text-sm text-gray-600 max-w-175 mt-1'>
              {profileData.about}
            </p>
          </div>

          {/* Appointment Fees */}
          <p className='text-gray-600 font-medium mt-4'>
            Appointment fees:

            <span className='text-gray-800'>
              {currency}

              {isEdit ? (
                <input
                  type="number"
                  value={profileData.fees}
                  onChange={(e) =>
                    setProfileData(prev => ({
                      ...prev,
                      fees: e.target.value
                    }))
                  }
                  className='border px-2 py-1 w-24 ml-2'
                />
              ) : (
                profileData.fees
              )}
            </span>
          </p>

          {/* Address */}
          <div className='flex gap-2 py-2'>
            <p>Address:</p>

            <div className='text-sm flex flex-col gap-2'>

              {isEdit ? (
                <input
                  type="text"
                  value={profileData.address?.line1 || ''}
                  onChange={(e) =>
                    setProfileData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line1: e.target.value
                      }
                    }))
                  }
                  className='border px-2 py-1'
                />
              ) : (
                <p>{profileData.address?.line1}</p>
              )}

              {isEdit ? (
                <input
                  type="text"
                  value={profileData.address?.line2 || ''}
                  onChange={(e) =>
                    setProfileData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line2: e.target.value
                      }
                    }))
                  }
                  className='border px-2 py-1'
                />
              ) : (
                <p>{profileData.address?.line2}</p>
              )}

            </div>
          </div>

          {/* Availability */}
          <div className='flex gap-1 pt-2'>
            <input
              checked={profileData.available || false}
              onChange={(e) =>
                setProfileData(prev => ({
                  ...prev,
                  available: e.target.checked
                }))
              }
              type="checkbox"
              id="available"
              disabled={!isEdit}
            />

            <label htmlFor="available">
              Available
            </label>
          </div>

          {/* Edit / Save Button */}
          {
            isEdit?
             <button onClick={updateProfile} className='px-4 py-1 border border-red-500 hover:text-white transition-all '>Save</button>:
              <button onClick={()=>setIsEdit(true)} className='px-4 py-1 border border-red-500 hover:text-white transition-all '>Edit</button>
          }
      

        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
