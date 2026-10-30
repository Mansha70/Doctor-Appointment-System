import userModel from "../models/userModel.js";
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {v2} from 'cloudinary'
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Razorpay from 'razorpay'
import { createHmac, timingSafeEqual } from 'node:crypto'

//API to register user

const registerUser=async(req,res)=>{
    try{
      const {name,email,password}=req.body
      if(!name || !email || !password){
        return res.json({
            success:false,
            message:"Missing Fields"
        })
      } 
      if(!validator.isEmail(email)){
        return res.json({
             success:false,
             message:"write email in proper format"
        })
      }
       if(password.length<8){
        return res.json({
            success:false,
            message:"Please make strong password"
        })
       }
      const salt=await bcrypt.genSalt(10)
       const hashedPassword=await bcrypt.hash(password,salt)
        const newUser=await userModel.create({
          name:name,
          email:email,
          password:hashedPassword
        })
       const token=await jwt.sign(
       {id:newUser._id},
          process.env.JWT_SECRET
       )
       return res.status(201).json({
        success:true,
        token,
        message:"User Registered Successfully!!"
       })

    }catch(error){
     console.log(error)
     return res.json({
        success:false,
        message:error.message
     })
    }
}
//API For user login
const LoginUser=async(req,res)=>{
  try{
    const {email,password}=req.body
  if(!email || !password){
    return res.json({
      success:false,
      message:"Please fill all Fields"
    })
  }
  const user=await userModel.findOne({email})
   if(!user){
     return res.json({
      success:false,
      message:"this user not exist!!Please register"
     })
   }
   const isMatch=await bcrypt.compare(password,user.password)
   if(isMatch){
     const token=await jwt.sign(
      {id:user._id},
      process.env.JWT_SECRET
     )
     res.json({
      success:true,
      token
     })
   }else{
    res.json({
      success:false,
       message:"Invalid credentials"
    })
   }

  }catch(error){
    return res.json({
      success:false,
      message:error.message
    })
  }
 

}
//API to get user profile data
const getProfile=async(req,res)=>{
  try{
   const userId=req.userId
  const userData=await userModel.findById(userId).select('-password')
  res.json({
    success:true,
    userData
  })
   
  }catch(error){
   return res.json({
      success:false,
      message:error.message
    })
  }

}
// API to update user profile
const updateProfile=async(req,res)=>{
  try{
   const {name,phone,address,dob,gender}=req.body
   const userId=req.userId
    const imageFile=req.file
    if(!name||!phone||!dob||!gender){
     return res.json({
      success:false,
      message:"Data missing"
     })
    }
     await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
     if(imageFile){
      //upload image to cloudinary
      const imageUpload=await v2.uploader.upload(imageFile.path,{resource_type:'image'})
      const imageURL=imageUpload.secure_url 
      await userModel.findByIdAndUpdate(userId,{image:imageURL})
     }
    res.json({
      success:true,
      message:"Profile Updated"
    })
  }catch(error){
    return res.json({
      success:false,
      message:error.message
    })
  }
}

//api to book appointment
const bookAppointment=async(req,res)=>{
  try{
   const {docId,slotDate,slotTime}=req.body
   const userId=req.userId
   const docData=await doctorModel.findById(docId).select('-password')
   if(!docData.available){
    return res.json({
      success:false,
      message:"doctor is not available"
    })
  }
    let slots_booked=docData.slots_booked
    // checking for slot availability
    if(slots_booked[slotDate]){
      if(slots_booked[slotDate].includes(slotTime)){
        return res.json({
      success:false,
      message:"slot not availble"
    })
      }else{
        slots_booked[slotDate].push(slotTime)
      }
    } else{
      slots_booked[slotDate]=[]
      slots_booked[slotDate].push(slotTime)
    }
   const userData=await userModel.findById(userId).select('-password')
   delete docData.slots_booked
   const appointmentData={
    userId,
    docId,
    userData,
    docData,
    amount:docData.fees,
    slotTime,
    slotDate,
    date:Date.now()
   }
   const newAppointment=new appointmentModel(appointmentData)
   await newAppointment.save() 
   await  doctorModel.findByIdAndUpdate(docId,{slots_booked})
   res.json({
    success:true, 
    message:"Appointment Booked"
   })
   }

    
  catch(error){
 return res.json({
      success:false,
      message:error.message
    })
  }
}
//api to get user appointments for frontend my-appointment page
const listAppointment=async(req,res)=>{
  try{
   const appointments=await appointmentModel.find({userId:req.userId})
   return res.json({
    success:true,
    appointments
   })
  }catch(error){
   return res.status(500).json({
    success:false,
    message:error.message
   })
  }
}

const cancelAppointment=async(req,res)=>{
  try{
   const {appointmentId}=req.body
   if(!appointmentId){
    return res.status(400).json({
     success:false,
     message:"Appointment ID is required"
    })
   }

   const appointment=await appointmentModel.findOne({
    _id:appointmentId,
    userId:req.userId
   })
   if(!appointment){
    return res.status(404).json({
     success:false,
     message:"Appointment not found"
    })
   }
   if(appointment.cancelled){
    return res.json({
     success:true,
     message:"Appointment already cancelled"
    })
   }

   const doctor=await doctorModel.findById(appointment.docId)
   if(doctor?.slots_booked?.[appointment.slotDate]){
    doctor.slots_booked[appointment.slotDate]=doctor.slots_booked[appointment.slotDate]
     .filter((time)=>time!==appointment.slotTime)
    if(doctor.slots_booked[appointment.slotDate].length===0){
     delete doctor.slots_booked[appointment.slotDate]
    }
    doctor.markModified('slots_booked')
    await doctor.save()
   }

   appointment.cancelled=true
   await appointment.save()

   return res.json({
    success:true,
    message:"Appointment cancelled"
   })
  }catch(error){
   return res.status(500).json({
    success:false,
    message:error.message
   })
  }
}

const paymentRazorpay=async(req,res)=>{
  try{
   const {appointmentId}=req.body
   if(!appointmentId){
    return res.status(400).json({
     success:false,
     message:"Appointment ID is required"
    })
   }

   const appointment=await appointmentModel.findOne({
    _id:appointmentId,
    userId:req.userId
   })
   if(!appointment || appointment.cancelled){
    return res.status(404).json({
     success:false,
     message:"Appointment cancelled or not found"
    })
   }
   if(appointment.payment){
    return res.status(400).json({
     success:false,
     message:"Appointment has already been paid"
    })
   }

   const keyId=process.env.Razorpay_key
   const keySecret=process.env.Razorpay_secret
   if(!keyId || !keySecret){
    return res.status(500).json({
     success:false,
     message:"Payment service is not configured"
    })
   }

   const razorpayInstance=new Razorpay({
    key_id:keyId,
    key_secret:keySecret
   })
   const order=await razorpayInstance.orders.create({
    amount:Math.round(appointment.amount*100),
    currency:process.env.CURRENCY || 'INR',
    receipt:String(appointment._id)
   })

   appointment.razorpayOrderId=order.id
   await appointment.save()

   return res.json({
    success:true,
    order,
    keyId
   })
  }catch(error){
   return res.status(500).json({
    success:false,
    message:error.message
   })
  }
}

const verifyRazorpay=async(req,res)=>{
 try{
  const {appointmentId,razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body
  if(!appointmentId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
   return res.status(400).json({
    success:false,
    message:"Missing payment verification details"
   })
  }

  const appointment=await appointmentModel.findOne({
   _id:appointmentId,
   userId:req.userId
  })
  if(!appointment || appointment.cancelled){
   return res.status(404).json({
    success:false,
    message:"Appointment cancelled or not found"
   })
  }
  if(appointment.payment){
   return res.status(400).json({
    success:false,
    message:"Appointment has already been paid"
   })
  }
  if(appointment.razorpayOrderId !== razorpay_order_id){
   return res.status(400).json({
    success:false,
    message:"Payment order does not match this appointment"
   })
  }

  const keySecret=process.env.Razorpay_secret
  if(!keySecret){
   return res.status(500).json({
    success:false,
    message:"Payment service is not configured"
   })
  }

  const expectedSignature=createHmac('sha256',keySecret)
   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
   .digest()
  const providedSignature=Buffer.from(razorpay_signature,'hex')
  if(providedSignature.length !== expectedSignature.length ||
     !timingSafeEqual(providedSignature,expectedSignature)){
   return res.status(400).json({
    success:false,
    message:"Payment signature verification failed"
   })
  }

  appointment.payment=true
  await appointment.save()
  return res.json({
   success:true,
   message:"Payment verified successfully"
  })
 }catch(error){
  return res.status(500).json({
   success:false,
   message:error.message
  })
 }
}

export {registerUser,LoginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay}