import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body

    if (!docId) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID is required'
      })
    }

    const docData = await doctorModel.findById(docId)

    if (!docData) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      })
    }

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      { available: !docData.available },
      { new: true }
    )

    return res.json({
      success: true,
      message: 'Availability Changed',
      doctor: updatedDoctor
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email'])

    return res.json({
      success: true,
      doctors
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//Api for  doctor Login
const loginDoctor=async(req,res)=>{
  try{
  const {email,password}=req.body 
   const doctor=await doctorModel.findOne({email})
    if(!doctor){
       return res.json({
        success:false,
        message:"Invalid credentials "
       })
    }
     const isMatch=await bcrypt.compare(password,doctor.password)
     if(!isMatch){
       return res.json({
         success:false,
         message:"Invalid Password!!"
       })
     }
     const token= jwt.sign(
      {
        id:doctor._id
      },
      process.env.JWT_SECRET
     )
     res.json({
      success:true,
      token
     })
  }catch(error){
     console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
//api to get doctor appointments for doctor panel

const appointmentsDoctor=async(req,res)=>{
  try{
  const {docId}=req.body 
  const appointments=await appointmentModel.find({docId})
  return res.json({
    success:true,
    appointments
  })

  }catch(error){
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
//API to mark appointment completed 
const appointmentComplete=async(req,res)=>{
  try{
   const {docId,appointmentId}=req.body
   const appointmentData=await appointmentModel.findById(appointmentId)
    if(appointmentData && appointmentData.docId===docId ){
    await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
    return res.json({
      success:true, 
      message:"Appointment Completed!!"
    })
    }else{
       return res.json({
      success:false, 
      message:"Mark failed!!"
    })
    }
  }catch(error){

  }
}

//API TO CANCEL APPOINTMENT FOR DOCTOR PANEL
const appointmentCancel=async(req,res)=>{
  try{
   const {docId,appointmentId}=req.body
   const appointmentData=await appointmentModel.findById(appointmentId)
    if(appointmentData && appointmentData.docId===docId ){
    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
    return res.json({
      success:true, 
      message:"Appointment Cancelled!!"
    })
    }else{
       return res.json({
      success:false, 
      message:"Cancellation failed!!"
    })
    }
  }catch(error){

  }
}

//Api to get dashboard data for doctor panel
const doctorDashboard=async(req,res)=>{
  try{
  const {docId}=req.body 
  const appointments=await appointmentModel.find({docId})
  let earning=0
  appointments.map((item)=>{
   if(item.isCompleted || item.payment){
    earning+=item.amount
   }
  })
  let patients=[] 
  appointments.map((item)=>{
    if(!patients.includes(item.userId)){
      patients.push(item.userId)
    }
  })
  const dashData={
    earning,
    appointments:appointments.length,
    patients:patients.length,
    latestApppintments:appointments.reverse().slice(0,5)

  }
  res.json({
    success:true,
    dashData
  })
  }catch(error){
    console.log(error)
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}
//api to get doctor profile for doctor panel
const doctorProfile=async(req,res)=>{
   try{
    const {docId}=req.body 
    const doctorProfile=await doctorModel.findById(docId).select('-password')
     res.json({
      success:true,
      doctorProfile
     })
   }catch(error){
     console.log(error)
    return res.status(500).json({
      success:false,
      message:error.message
    })
   }
}
//api to update doctor profile for doctor panel
const updateDoctorProfile=async(req,res)=>{
  try{
  const {docId,fees,address,available}=req.body

  await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
  res.json({
    success:true,
    message:"Profile Updated!!"
  })
  }catch(error){
   console.log(error)
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

export { changeAvailability,doctorList,loginDoctor,appointmentsDoctor,appointmentCancel,appointmentComplete,doctorDashboard
  ,doctorProfile,updateDoctorProfile
}