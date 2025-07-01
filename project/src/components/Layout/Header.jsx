
// import { Bell, User } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

// export default function Header({ title }) {
//   const { user } = useAuth();

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
//           <p className="text-gray-600 text-sm">
//             Supervisors Training Centre - Northern Railway
//           </p>
//         </div>

//         <div className="flex items-center gap-4">
//           <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//             <Bell className="h-5 w-5" />
//           </button>

//           <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
//             <div className="bg-blue-100 p-2 rounded-full">
//               <User className="h-5 w-5 text-blue-600" />
//             </div>
//             <div className="text-sm">
//               <p className="font-medium text-gray-900">{user?.name}</p>
//               <p className="text-gray-500 capitalize">{user?.role}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


import { Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Header({ title }) {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 text-sm">
            Supervisors Training Centre - Northern Railway
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Optional Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
          </button>

          {/* Profile Link */}
          <Link to="/profile" className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:opacity-80 transition-opacity">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-sm text-left">
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-gray-500 capitalize">{user?.role}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

