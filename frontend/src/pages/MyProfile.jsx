import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const MyProfile = () => {
   const {userData,setUserData,token,backendUrl,loadUserProfileData,isUserProfileLoading}=useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false);
  const [image,setImage]=useState(false)
  const updateUserProfileData=async()=>{
    try{
    const formData=new FormData()
     formData.append('name',userData.name)
     formData.append('phone',userData.phone)
     formData.append('address',JSON.stringify(userData.address))
     formData.append('gender',userData.gender)
     formData.append('dob',userData.dob)
     image && formData.append('image',image)

     const {data}=await axios.post(backendUrl+'/api/user/update-profile',formData,{headers:{token}})
     if(data.success){
      toast.success(data.message)
     await loadUserProfileData()
     setIsEdit(false)
     setImage(false)
     }else{
      toast.error(data.message)
     }

    
    }catch(error){
     toast.error(error.message)
    }
  }

  if (isUserProfileLoading) {
    return <p className="min-h-[50vh] flex items-center justify-center">Loading your profile...</p>
  }

  if (!token) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <p>Please log in to view your profile.</p>
        <Link className="bg-primary text-white px-6 py-2 rounded-full" to="/login">Log in</Link>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <p>Unable to load your profile.</p>
        <button className="bg-primary text-white px-6 py-2 rounded-full" onClick={loadUserProfileData}>Try again</button>
      </div>
    )
  }

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
       {
        isEdit?
        <label htmlFor="image">
          <div className='inline-block relative cursor-pointer'>
            <img className='w-36 rounded opacity-75' src={image?URL.createObjectURL(image):(userData.image || assets.profile_pic)} onError={(event)=>{event.currentTarget.src=assets.profile_pic}} alt="Profile"/>
            <img className='w-10 absolute bottom-12 right-12' src={image?'':assets.upload_icon} alt=""/>
          </div>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden/>
        </label>:
       <img className='w-36 rounded' src={userData.image || assets.profile_pic} onError={(event)=>{event.currentTarget.src=assets.profile_pic}} alt="Profile" />
       }
      {/* Profile Image */}
    

      {/* Name */}
      {isEdit ? (
        <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4'
          type="text"
          value={userData.name}
          onChange={(e) =>
            setUserData((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
      ) : (
        <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      )}

      <hr className='bg-zinc-400 h-px border-none' />

      {/* Contact Information */}
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>

        <div className='grid grid-cols-[1fr_3fr] gap-y-2 mt-3 '>
          {/* Email */}
          <p className='font-medium'>Email Id:</p>
          <p className='text-blue-500'>{userData.email}</p>

          {/* Phone */}
          <p className='font-medium'>Phone:</p>

          {isEdit ? (
            <input className='bg-gray-100 max-w-52' 
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          ) : (
            <p className='text-blue-400'>{userData.phone}</p>
          )}

          {/* Address */}
          <p className='font-medium'>Address:</p>

          {isEdit ? (
            <p>
              {/* Address Line 1 */}
              <input className='bg-gray-50'
                type="text"
                value={userData.address?.line1 || ""}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: {
                      ...(prev.address || {}),
                      line1: e.target.value,
                    },
                  }))
                }
              />

              <br />

              {/* Address Line 2 */}
              <input className='bg-gray-50'
                type="text"
                value={userData.address?.line2 || ""}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: {
                      ...(prev.address || {}),
                      line2: e.target.value,
                    },
                  }))
                }
              />
            </p>
          ) : (
            <p className='text-gray-500'>
              {userData.address?.line1}
              <br />
              {userData.address?.line2}
            </p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>

        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          {/* Gender */}
          <p className='font-medium'>Gender:</p>

          {isEdit ? (
            <select className='max-w-20 bg-gray-100'
              value={userData.gender}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }))
              }
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className='text-gray-400'>{userData.gender}</p>
          )}

          {/* Birthday */}
          <p className='font-medium'>Birthday:</p>

          {isEdit ? (
            <input className='max-w-28 bg-gray-100'
              type="date"
              value={userData.dob}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  dob: e.target.value,
                }))
              }
            />
          ) : (
            <p  className='text-gray-400'>{userData.dob}</p>
          )}
        </div>
      </div>

      <div className='mt-10'>
        {
          isEdit?<button className='border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all '  onClick={updateUserProfileData} >Save information</button>:
          <button className='border-primary px-8 py-2 rounded-full  hover:bg-primary hover:text-white transition-all'  onClick={()=>setIsEdit(true)} >Edit</button>
        }
      </div>
    </div>
  );
};

export default MyProfile;