import { assets } from '../../assets/assets'
import { useEffect, useState,useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'
const AddDoctor = () => {
  const [docImg,setDocImg]=useState(null)
  const [docImgPreview,setDocImgPreview]=useState(assets.upload_area)
      const [name,setName]=useState(' ')
      const [email,setEmail]=useState(' ')
      const [password,setPassword]=useState(' ')
      const [experience,setExperience]=useState('1 year')
      const [fee,setFee]=useState(' ')
      const [about,setAbout]=useState(' ')
      const [speciality,setSpeciality]=useState('General physician')
      const [address1,setAddress1]=useState(' ')
      const [address2,setAddress2]=useState(' ')
      const [education,setEducation]=useState(' ')

      

useEffect(() => {
  if (!docImg) {
    setDocImgPreview(assets.upload_area)
    return
  }

  const previewUrl = URL.createObjectURL(docImg)
  setDocImgPreview(previewUrl)

  return () => URL.revokeObjectURL(previewUrl)
}, [docImg])


const {backendUrl,aToken}=useContext(AdminContext)

const onSubmitHandler=async(event)=>{
   event.preventDefault()
   try{
    if(!docImg){
      return toast.error('image not selected')
    }
    const formData=new FormData() 
    formData.append('image',docImg)
    formData.append('name',name)
    formData.append('password',password)
    formData.append('experience',experience)
    formData.append('fees',Number(fee))
    formData.append('about',about)
    formData.append('speciality',speciality)
    formData.append('email',email)
    formData.append('degree',education)
    formData.append('address',JSON.stringify({line1:address1,line2:address2}))
   const {data}=await axios.post(backendUrl+'/api/admin/add-doctor',formData,{headers:{aToken}})
   if(data.success){
    toast.success(data.message)
    setDocImg(false)
    setName('')
    setEmail('')
    setPassword('')
    setFee('')
    setAddress1('')
    setAddress2('')
    setAbout('')
    setEducation('')
   }else{
    toast.error(data.message)
   }

   }catch(error){
    toast.error(error.message)
    console.log(error)
   }
}

  return (
    <form className='m-5 w-full' onSubmit={onSubmitHandler}>

      <p className='mb-3 text-lg font-medium'>
        Add Doctor
      </p>

      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>

        {/* Upload Doctor Image */}
        <div className='flex items-center gap-4 mb-8 text-gray-500'>

          <label htmlFor="doc-img">
            <img
              className='w-16 bg-gray-100 rounded-full cursor-pointer'
              src={docImgPreview}
              alt=""
            />
          </label>

          <input
            type="file"
            id="doc-img"
            accept="image/*"
            hidden
            onChange={(e)=>setDocImg(e.target.files[0])}
          />

          <p>
            Upload doctor
            <br />
            picture
          </p>

        </div>

        {/* Doctor Details */}
        <div className='flex flex-col lg:flex-row items-start gap-8 text-gray-600'>

          <div className='w-full lg:flex-1 flex flex-col gap-4 '>

            <div className='flex-1 flex flex-col gap-4'>
              <p>Doctor name</p>
              <input className='border rounded px-3 py-2'
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                required
              />
            </div>

            <div className='flex-1 flex flex-col gap-4'>
              <p>Doctor Email</p>
              <input className='border rounded px-3 py-2'
                type="email"
                placeholder="Email"
                 value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
            </div>

            <div className='flex-1 flex flex-col gap-4'>
              <p>Doctor Password</p>
              <input className='border rounded px-3 py-2'
                type="password"
                placeholder="Password"
                 value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
            </div>

            <div className='flex-1 flex flex-col gap-4'>
              <p>Experience</p>

              <select onChange={(e)=>setExperience(e.target.value)} value={experience}>
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-4'>
              <p>Fees</p>
              <input className='border rounded px-3 py-2'
                type="text"
                placeholder="Your fees"
                 value={fee}
                onChange={(e)=>setFee(e.target.value)}
                required
              />
            </div>
            <div className='w-full lg:flex-1 flex flex-col gap-4 '>
            <div className='flex-1 flex flex-col gap-4'>
              <p>Speciality</p>

              <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality}>
                <option value="General physician">
                  General physician
                </option>

                <option value="Gynecologist">
                  Gynecologist
                </option>

                <option value="Dermatologist">
                  Dermatologist
                </option>

                <option value="Pediatrician">
                  Pediatrician
                </option>

                <option value="Neurologist">
                  Neurologist
                </option>

                <option value="Gastroenterologist">
                  Gastroenterologist
                </option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-4'>
              <p>Education</p>

              <input className='border rounded px-3 py-2'
                type="text"
                placeholder="Education"
                 value={education}
                onChange={(e)=>setEducation(e.target.value)}
                required
              />
            </div>


          {/* Address */}
          <div className='flex-1 flex flex-col gap-4'>

            <p>Address</p>

            <input className='border rounded px-3 py-2'
              type="text"
              placeholder="Address1"
              value={address1}
              onChange={(e)=>setAddress1(e.target.value)}
              required
            />

            <input className='border rounded px-3 py-2'
              type="text"
              placeholder="Address2"
              value={address2}
              onChange={(e)=>setAddress2(e.target.value)}
              required
            />

          </div>
          </div>

          </div>

          <div className='w-full flex-1'>
            {/* About Doctor */}
            <div>

              <p className='mt-4 mb-2'>About Doctor</p>

              <textarea className='w-full px-4 pt-2 border rounded'
                type="text"
                placeholder="Write about doctor"
                rows={5}
                value={about}
                onChange={(e)=>setAbout(e.target.value)}
                required
              />

            </div>

            <button type="submit" className='px-10 py-3 mt-4 text-white  rounded-full bg-[#5F6FFF]' type="submit">
              Add Doctor
            </button>
          </div>

        </div>

      </div>

    </form>
  )
}

export default AddDoctor