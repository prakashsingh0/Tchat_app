import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LogInPage from './pages/LogInPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'
import DraggableFloatingButton from './components/DraggableFloatingButton'

function App() {
  const icon = '/message.svg'
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log(onlineUsers);
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth]);
  console.log({ authUser });

  if (isCheckingAuth && !authUser) {
    return (<div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>)
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <DraggableFloatingButton icon={icon}/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <LogInPage /> : <Navigate to="/" />} />
        <Route path='/setting' element={<SettingPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster
        position="top-right"
        reverseOrder={false} />
    </div>
  )
}

export default App
