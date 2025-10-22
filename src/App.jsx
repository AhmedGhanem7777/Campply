// src/App.jsx
import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingSupportButton from '@/components/FloatingSupportButton';
import MainLayout from '@/components/layout/MainLayout';

import Home from '@/pages/Home';
import AboutUs from '@/pages/AboutUs';
import JoinUs from '@/pages/JoinUs';
import ContactUs from '@/pages/ContactUs';
import CampDetails from '@/pages/CampDetails';
import SearchResults from '@/pages/SearchResults';
import Terms from '@/pages/Terms';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Favorites from '@/pages/Favorites';
import AllCampsPage from '@/pages/AllCampsPage';

import Login from './Authontication/Login';
import Register from './Authontication/Register';
import ForgetPass from './Authontication/ForgetPass';
import ResetPassword from './Authontication/ResetPassword';
import ConfirmEmail from './Authontication/ConfirmEmail';
import ConfirmEmailCallback from './Authontication/ConfirmEmailCallback';

import DashboardContent from './Dashboard/DashboardContent';
import CampsPage from './Dashboard/CampsPage';
import Bookings from './Dashboard/Bookings';
import Users from './Dashboard/Users';
import LocationsPage from './Dashboard/Locations';
import NotificationsPage from './Dashboard/Notifications';
import MyCamps from './Dashboard/MyCamps';
import AdminJoinRequests from './Dashboard/AdminJoinRequests';
import AdminPlansPage from './Dashboard/AdminPlansPage';
import ChangePass from './Dashboard/ChangePasswordForm';

import { ProtectedRoute, GuestOnlyRoute } from '@/routes/guards';
import AdminCustomers from './Dashboard/AdminCustomers';
import OwnerReviews from './Dashboard/OwnerReviews';
import Pricing from './pages/Pricing';
import ChangePassword from './pages/ChangePassword';

function App() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const authPaths = ['/login', '/register', '/forgetpass', '/resetpass', '/confirmemail', '/confirm-email'];
  const isAuthPage = authPaths.includes(path);
  const isDashboard = path.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      {!isAuthPage && !isDashboard && <Header />}

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/confirm-email" element={<ConfirmEmailCallback />} />

            <Route path="/login"        element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />
            <Route path="/register"     element={<GuestOnlyRoute><Register /></GuestOnlyRoute>} />
            <Route path="/forgetpass"   element={<GuestOnlyRoute><ForgetPass /></GuestOnlyRoute>} />
            <Route path="/resetpass"    element={<GuestOnlyRoute><ResetPassword /></GuestOnlyRoute>} />
            <Route path="/confirmemail" element={<GuestOnlyRoute><ConfirmEmail /></GuestOnlyRoute>} />

            <Route path="/home"            element={<Home />} />
            <Route path="/about"           element={<AboutUs />} />
            <Route path="/join"            element={<JoinUs />} />
            <Route path="/contact"         element={<ContactUs />} />
            <Route path="/all-camps"       element={<AllCampsPage />} />
            <Route path="/camps/:id"       element={<CampDetails />} />
            <Route path="/search"          element={<SearchResults />} />
            <Route path="/terms"           element={<Terms />} />
            <Route path="/privacy-policy"  element={<PrivacyPolicy />} />
            <Route path="/favorites"       element={<Favorites />} />
            {/* <Route path="/pricing"       element={<Pricing />} /> */}
            <Route path="/change-password"       element={<ChangePassword />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allow={['مسؤول', 'صاحب_مخيم']}>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardContent />} />
              <Route path="camps"           element={<CampsPage />} />
              <Route path="mycamps"         element={<MyCamps />} />
              <Route path="ownerReviews"    element={<OwnerReviews />} />
              <Route path="bookings"        element={<Bookings />} />
              <Route path="users"           element={<Users />} />
              <Route path="plans"           element={<AdminPlansPage />} />
              <Route path="joinrequests"    element={<AdminJoinRequests />} />
              <Route path="adminCustomers"  element={<AdminCustomers />} />
              <Route path="locations"       element={<LocationsPage />} />
              <Route path="notifications"   element={<NotificationsPage />} />
              <Route path="settings"        element={<ChangePass />} />
            </Route>

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isAuthPage && !isDashboard && <Footer />}
      {!isAuthPage && !isDashboard && <FloatingSupportButton />}
    </div>
  );
}

export default App;
