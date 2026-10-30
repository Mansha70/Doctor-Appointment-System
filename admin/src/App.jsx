
import Navbar from './Components/Navbar'
import { useContext } from 'react'
import { AdminContext } from './context/AdminContext'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import Sidebar from './Components/Sidebar'
import {Navigate,Routes,Route} from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard'
import AllAppointment from './pages/Admin/AllAppointment'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorList from './pages/Admin/DoctorList'
import { DoctorContext } from './context/DoctorContext'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorAppointment from './pages/Doctor/DoctorAppointment'
import DoctorProfile from './pages/Doctor/DoctorProfile'

const App = () => {
  const { aToken } = useContext(AdminContext)
   const {dToken}=useContext(DoctorContext)
  return aToken || dToken? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/*Admin Route */}
        <Route path='/' element={<Navigate to={aToken ? '/admin-dashboard' : '/doctor-dashboard'} replace/>}/>
          <Route path='/admin-dashboard' element={<Dashboard/>}/>
        <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
          <Route path='/all-appointments' element={<AllAppointment/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/doctor-list' element={<DoctorList/>}/>
          {/*Doctor Route*/}
         <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
           <Route path='/doctor-appointment' element={<DoctorAppointment/>}/>
             <Route path='/doctor-profile' element={<DoctorProfile/>}/>
        </Routes>
        
      </div>
    </div>
  ):(
    <>
     <Login/>
    </>
  )
}

export default App