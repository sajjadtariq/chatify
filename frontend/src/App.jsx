import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';  // Use location
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './components/store/useAuthStore';
import Layout from './Layout';
import { Toaster } from 'react-hot-toast';
import FriendRequest from './pages/FriendRequest';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/app-sidebar';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex justify-center items-center text-5xl">
        Loading...
      </div>
    );
  }

  const chatpage = location.pathname === '/';


  return (
    <SidebarProvider>
      {/* {chatpage && <AppSidebar />} */}
      <div className=" app-background w-full min-h-[100vh]">
        <Layout className={``}>
          {/* {chatpage && <SidebarTrigger arrow='true' className='flex lg:hidden' />} */}
          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" replace />} />
            <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" replace />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" replace />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />} />
            <Route path="/friendrequest" element={authUser ? <FriendRequest /> : <Navigate to="/login" replace />} />
          </Routes>

          <Toaster
            toastOptions={{
              className: '',
              style: {
                backgroundColor: '#000',
                color: '#fff',
              },
            }}
          />
        </Layout>
      </div>
    </SidebarProvider >

  );
};

export default App;
