import { Navigate, Route, Routes } from "react-router-dom"
import Home from "../pages/User"
import AdminLogin from "../components/admin/Login"
import Dashboard from "../pages/admin/dashboard/Dashboard"
import Login from "../components/user/Login"
import Users from "../pages/admin/dashboard/users/Users"

const UserRouter :React.FC =() => {

  return(
    <Routes>
      <Route path="home" element={<Home/>}/>
      <Route path="login-register" element={<Home/>}/>
      <Route path="login" element={<Home/>}/>
      <Route path="register" element={<Home/>}/>
      <Route path="google-login" element={<Home/>}/>
      <Route path="profile" element={<Home/>}/>
      <Route path="edit-profile" element={<Home/>}/>
      <Route path="otp-verification" element={<Home/>}/>

    </Routes>
  )
}

const AdminRouter :React.FC =() => {

  return(
    <Routes>
      <Route path="/*" element={<AdminLogin/>}/>
      <Route path="/login" element={<AdminLogin/>} />
      <Route path="*" element={<Navigate to="/admin/login"/>}/>
      {/* <Route path="dashboard" element={<Dashboard/>}/> */}
      <Route path="dashboard/*" element={<Dashboard />} />
    </Routes>
  )
  
}

const AppRouter : React.FC = () => {
   return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/user/*" element={<UserRouter/>}/>
      <Route path="/admin/*" element = {<AdminRouter/>}/>
    </Routes>
   )
}

export default AppRouter;