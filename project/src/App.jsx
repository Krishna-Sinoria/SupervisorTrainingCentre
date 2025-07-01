/*DONT DELETE THESE CHANGES*/
// import React, { useState } from 'react';

// import { AuthProvider, useAuth } from './context/AuthContext'; // ✅ Will use backend later inside AuthContext
// import { DataProvider } from './context/DataContext'; // ✅ If using real-time data, you may later fetch from backend

// import Login from './components/Login'; // ✅ This uses AuthContext.login() — replace logic in AuthContext only

// // Layout
// import Sidebar from './components/Layout/Sidebar';
// import Header from './components/Layout/Header';

// // Director Components
// import DirectorDashboard from './components/Director/Dashboard';
// import Analytics from './components/Director/Analytics';
// import ViewTrainers from './components/Director/ViewTrainers';
// import RoleManager from './components/Director/RoleManager';

// // Trainer Components
// import TrainerDashboard from './components/Trainer/Dashboard';
// import AddTraineeForm from './components/Trainer/AddTraineeForm';
// import ViewTrainees from './components/Trainer/ViewTrainees';
// import Marksheet from './components/Trainer/Marksheet';
// import IDCard from './components/Trainer/IDCard';

// // Common
// import Profile from './components/Common/Profile';

// function AppContent() {
//   const { user, isLoading } = useAuth(); // ✅ `user` comes from AuthContext, which you will wire to backend later
//   const [activeSection, setActiveSection] = useState('dashboard');

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading STC Training Management System...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Login />; // ✅ Login logic is in AuthContext; just swap mock login with real login API there
//   }

//   const getSectionTitle = () => {
//     const titles = {
//       dashboard: 'Dashboard',
//       analytics: 'Analytics',
//       trainers: 'View Trainers',
//       trainees:'View Trainees',
//       roles: 'Role Manager',
//       'add-trainee': 'Add Trainee',
//       marksheet: 'Marksheet Management',
//       'id-card': 'ID Card Generation',
//       profile: 'My Profile'
//     };
//     return titles[activeSection] || 'Dashboard';
//   };

//   const handleNavigation = (section) => {
//     setActiveSection(section);
//   };

//   const renderContent = () => {
//     if (activeSection === 'add-trainee') return <AddTraineeForm />;
//     if (activeSection === 'profile') return <Profile />;

//     // ✅ Role-based rendering — works now, no change needed
//     if (user.role === 'director') {
//       switch (activeSection) {
//         case 'analytics':
//           return <Analytics />;
//         case 'trainers':
//           return <ViewTrainers />;
//         case 'roles':
//           return <RoleManager />;
//         default:
//           return <DirectorDashboard onNavigate={handleNavigation} />;
//       }
//     } else {
//       switch (activeSection) {
//         case 'marksheet':
//           return <Marksheet />;
//           case 'trainees':
//           return <ViewTrainees loggedInTrainerId={user?.id}/>;
//         case 'id-card':
//           return <IDCard />;
//         default:
//           return <TrainerDashboard onNavigate={handleNavigation} />;
//       }
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header title={getSectionTitle()} />
//         <main className="flex-1 overflow-y-auto p-6">
//           {renderContent()}
//         </main>
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     // ✅ AuthProvider → later will be connected to backend for login/logout/updateUser
//     <AuthProvider>
//       {/* ✅ DataProvider → optionally switch to use data from backend if needed */}
//    <DataProvider>
//      <AppContent />
//    </DataProvider>
       
   
//     </AuthProvider>
//   );
// }

// export default App;


import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Pages
import Login from './components/Login';
import DirectorDashboard from './components/Director/Dashboard';
import Analytics from './components/Director/Analytics';
import ViewTrainers from './components/Director/ViewTrainers';
import RoleManager from './components/Director/RoleManager';

import TrainerDashboard from './components/Trainer/Dashboard';
import AddTraineeForm from './components/Trainer/AddTraineeForm';
import ViewTrainees from './components/Trainer/ViewTrainees';
import Marksheet from './components/Trainer/Marksheet';
import IDCard from './components/Trainer/IDCard';

import Attendance from './components/Trainer/Attendance';


import Profile from './components/Common/Profile';

// Layout
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

// 🛡 Role-based private route wrapper
function PrivateRoute({ allowedRoles, children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading STC Training Management System...</p>
        </div>
      </div>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// 💡 Shared layout with header/sidebar
function LayoutWrapper() {
  const { user } = useAuth();

  const getSectionTitle = () => {
    const path = window.location.pathname;
    const map = {
      '/dashboard': 'Dashboard',
      '/analytics': 'Analytics',
      '/trainers': 'View Trainers',
      '/roles': 'Role Manager',
      '/add-trainee': 'Add Trainee',
      '/marksheet': 'Marksheet Management',
      '/id-card': 'ID Card Generation',
      '/trainees': 'View Trainees',
    
      '/profile': 'My Profile'
    };
    return map[path] || 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getSectionTitle()} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// 🌐 App routes
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Layout */}
      <Route path="/" element={<PrivateRoute><LayoutWrapper /></PrivateRoute>}>
        {/* Dashboard */}
        <Route
          path="dashboard"
          element={user?.role === 'director' ? <DirectorDashboard /> : <TrainerDashboard />}
        />

        {/* Director-only Routes */}
        <Route path="analytics" element={
          <PrivateRoute allowedRoles={['director']}><Analytics /></PrivateRoute>
        } />
        <Route path="trainers" element={
          <PrivateRoute allowedRoles={['director']}><ViewTrainers /></PrivateRoute>
        } />
        <Route path="roles" element={
          <PrivateRoute allowedRoles={['director']}><RoleManager /></PrivateRoute>
        } />

        {/* Trainer-only Routes */}
        <Route path="trainees" element={
          <PrivateRoute allowedRoles={['trainer']}><ViewTrainees loggedInTrainerId={user?.id} /></PrivateRoute>
        } />
        <Route path="marksheet" element={
          <PrivateRoute allowedRoles={['trainer']}><Marksheet /></PrivateRoute>
        } />
        <Route path="id-card" element={
          <PrivateRoute allowedRoles={['trainer']}><IDCard /></PrivateRoute>
        } />
        <Route path="/Trainer/Attendance" element={<Attendance />} />
       

        {/* Common Route */}
        <Route path="profile" element={<Profile />} />
        <Route index element={<Navigate to="/dashboard" />} />
         <Route path="add-trainee" element={
        <PrivateRoute allowedRoles={['trainer', 'director']}><AddTraineeForm /></PrivateRoute>
          } />

      </Route>


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

// 🌟 Root App
function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppRoutes />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;