import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import Log_inPage from "./pages/auth/login/Log_inPage"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"

import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import LoadingSpinner from "./components/common/LoadingSpinner"
function App() {

  const {data: authUser, isLoading} = useQuery({
    queryKey: ['authUser'],
    queryFn: async() => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if(data.error) return null;
        if(!res.ok || data.error) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error ) {
        throw new Error(error)
      }
    },
    retry: false
  })

  if(isLoading){
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  return (
   <div className='flex max-w-6xl mx-auto'>
   {authUser && <Sidebar />}
    <Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to={"/login"} />}  />
				<Route path='/login' element={!authUser ? <Log_inPage /> : <Navigate to={"/"} />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
				<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to={"/login"} />} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
			</Routes>
      <RightPanel />
      <Toaster />
   </div>
  )
}

export default App
