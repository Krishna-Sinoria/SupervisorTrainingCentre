
// import Image from "../../../public/STC_logo.png"
// import { 
//   Home, 
//   BarChart3, 
//   Users, 
//   Settings, 
//   UserPlus, 
//   FileText, 
//   CreditCard,
//   LogOut,
//   User
// } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

// export default function Sidebar({ activeSection, onSectionChange }) {
//   const { user, logout } = useAuth();

//   const directorMenuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Home },
//     { id: 'analytics', label: 'Analytics', icon: BarChart3 },
//     { id: 'trainers', label: 'View Trainers', icon: Users },
//     { id: 'add-trainee', label: 'Add Trainee', icon: UserPlus },
//     { id: 'roles', label: 'Role Manager', icon: Settings },
//     { id: 'profile', label: 'My Profile', icon: User },
//   ];

//   const trainerMenuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Home },
//     { id: 'add-trainee', label: 'Add Trainee', icon: UserPlus },
//     { id: 'marksheet', label: 'Marksheet', icon: FileText },
//     { id: 'id-card', label: 'ID Card Generation', icon: CreditCard },
//     { id: 'profile', label: 'My Profile', icon: User },
//   ];

//   const menuItems = user?.role === 'director' ? directorMenuItems : trainerMenuItems;

//   return (
//     <div className="bg-blue-900 text-white w-64 min-h-screen flex flex-col">
//       {/* Logo and Header */}
//       <div className="p-6 border-b border-blue-800">
//         <div className="flex items-center gap-3">
//           <img src={Image} className="h-13 w-18 text-blue-300" />
//           <div>
//             <h1 className="font-bold text-lg">STC</h1>
//             <p className="text-blue-300 text-sm">Northern Railway</p>
//           </div>
//         </div>
//       </div>

//       {/* User Info */}
//       <div className="p-4 border-b border-blue-800">
//         <div className="text-sm">
//           <p className="font-medium">{user?.name}</p>
//           <p className="text-blue-300">{user?.position}</p>
//           <p className="text-blue-300 text-xs capitalize">{user?.role}</p>
//         </div>
//       </div>

//       {/* Navigation Menu */}
//       <nav className="flex-1 p-4">
//         <ul className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <li key={item.id}>
//                 <button
//                   onClick={() => onSectionChange(item.id)}
//                   className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
//                     activeSection === item.id
//                       ? 'bg-blue-800 text-white'
//                       : 'text-blue-100 hover:bg-blue-800 hover:text-white'
//                   }`}
//                 >
//                   <Icon className="h-5 w-5" />
//                   {item.label}
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       {/* Logout */}
//       <div className="p-4 border-t border-blue-800">
//         <button
//           onClick={logout}
//           className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
//         >
//           <LogOut className="h-5 w-5" />
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }


import Image from "../../../public/STC_logo.png";
import {
  Home,
  BarChart3,
  Users,
  Settings,
  UserPlus,
  FileText,
  CreditCard,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const directorMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/trainers', label: 'View Trainers', icon: Users },
    { path: '/add-trainee', label: 'Add Trainee', icon: UserPlus },
    { path: '/roles', label: 'Role Manager', icon: Settings },
    { path: '/profile', label: 'My Profile', icon: User }
  ];

 const trainerMenuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/add-trainee', label: 'Add Trainee', icon: UserPlus },
  { path: '/marksheet', label: 'Marksheet', icon: FileText },
  { path: '/id-card', label: 'ID Card Generation', icon: CreditCard },
  { path: '/trainees', label: 'View Trainees', icon: Users },
  { path: '/trainer/attendance', label: 'Attendance', icon: FileText }, // 👈 NEW LINE
  { path: '/profile', label: 'My Profile', icon: User }
];

  const menuItems = user?.role === 'director' ? directorMenuItems : trainerMenuItems;

  return (
    <div className="bg-blue-900 text-white w-64 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <img src={Image} className="h-13 w-18 text-blue-300" />
          <div>
            <h1 className="font-bold text-lg">STC</h1>
            <p className="text-blue-300 text-sm">Northern Railway</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-blue-800">
        <div className="text-sm">
          <p className="font-medium">{user?.name}</p>
          <p className="text-blue-300">{user?.position}</p>
          <p className="text-blue-300 text-xs capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}

