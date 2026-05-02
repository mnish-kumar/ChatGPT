import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import PublicRoute from '@/components/PublicRoute'
import ProtectedRoute from '@/components/ProtectedRoute'
import Dashboard from '@/pages/Dashboard'
import ForgetPassword from '@/pages/ForgetPassword'
import ResetPassword from '@/pages/ResetPassword'
import UserProfile from '@/pages/user/UserProfile'

const MainRoute = () => {
  return (
    <div>
        <Routes>

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
            </Route>

            <Route element={<PublicRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path='/forget-password' element={<ForgetPassword />} />
              <Route path='/reset-password' element={<ResetPassword />} />
            </Route>
        </Routes>
    </div>
  )
}

export default MainRoute