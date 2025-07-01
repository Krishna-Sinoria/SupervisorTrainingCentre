// import { useState , useEffect } from 'react';
// import { Users, FileText, CreditCard, TrendingUp } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';
// import { useData } from '../../context/DataContext';

// export default function TrainerDashboard({ onNavigate }) {
//   const { user } = useAuth();
//   const { getTraineesByTrainer } = useData();

//   const [myTrainees, setMyTrainees] = useState([]);

//   useEffect(() => {
//     const loadTrainees = async () => {
//       if (!user?.id) return;
//       const result = await getTraineesByTrainer(user.id);
//       setMyTrainees(result || []);
//     };
//     loadTrainees();
//   }, [user]);

//   const completedTrainees = myTrainees.filter(t => t.grade && t.grade !== '');
//   const pendingMarksheets = myTrainees.filter(t => !t.marks);
//   const stats = [
//     {
//       title: 'My Trainees',
//       value: myTrainees.length,
//       icon: Users,
//       color: 'bg-blue-500',
//       change: `+${myTrainees.length} this month`
//     },
//     {
//       title: 'Completed',
//       value: completedTrainees.length,
//       icon: TrendingUp,
//       color: 'bg-green-500',
      
//     },
//     {
//       title: 'Pending Marksheets',
//       value: pendingMarksheets.length,
//       icon: FileText,
//       color: 'bg-orange-500',
      
//     },
//     {
//       title: 'ID Cards Issued',
//       value: myTrainees.length,
//       icon: CreditCard,
//       color: 'bg-purple-500',
      
//     }
//   ];

//   const recentTrainees = myTrainees.slice(-5).reverse();

//   return (
//     <div className="space-y-6">
//       <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
//         <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
//         <p className="text-blue-100">
//           You have {myTrainees.length} trainees under your guidance.
//           {pendingMarksheets.length > 0 && ` ${pendingMarksheets.length} marksheets are pending.`}
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
//                   <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
//                 </div>
//                 <div className={`p-3 rounded-full ${stat.color}`}>
//                   <Icon className="h-6 w-6 text-white" />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">Recent Trainees</h3>
//         </div>
//         <div className="p-6">
//           {recentTrainees.length > 0 ? (
//             <div className="space-y-4">
//               {recentTrainees.map((trainee) => (
//                 <div key={trainee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div className="flex items-center gap-4">
//                     <div className="bg-blue-100 p-2 rounded-full">
//                       <Users className="h-4 w-4 text-blue-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">{trainee.fullName}</p>
//                       <p className="text-sm text-gray-600">{trainee.moduleNumber} - {trainee.designation}</p>
//                       <p className="text-xs text-gray-500">ID: {trainee.id}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm font-medium text-gray-900">
//                       {trainee.grade ? `Grade: ${trainee.grade}` : 'Pending'}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Joined: {new Date(trainee.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600">No trainees added yet</p>
//               <p className="text-sm text-gray-500 mt-1">Start by adding your first trainee using the form</p>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <button 
//             onClick={() => onNavigate?.('add-trainee')}
//             className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
//           >
//             <div className="flex items-center gap-3 mb-2">
//               <Users className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
//               <h4 className="font-medium text-gray-900">Add New Trainee</h4>
//             </div>
//             <p className="text-sm text-gray-600 mt-1">Register a new trainee in the system</p>
//           </button>
//           <button 
//             onClick={() => onNavigate?.('marksheet')}
//             className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
//           >
//             <div className="flex items-center gap-3 mb-2">
//               <FileText className="h-5 w-5 text-green-600 group-hover:text-green-700" />
//               <h4 className="font-medium text-gray-900">Update Marksheets</h4>
//             </div>
//             <p className="text-sm text-gray-600 mt-1">Add or update trainee marks</p>
//           </button>
//           <button 
//             onClick={() => onNavigate?.('id-card')}
//             className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
//           >
//             <div className="flex items-center gap-3 mb-2">
//               <CreditCard className="h-5 w-5 text-purple-600 group-hover:text-purple-700" />
//               <h4 className="font-medium text-gray-900">Generate ID Cards</h4>
//             </div>
//             <p className="text-sm text-gray-600 mt-1">Create printable ID cards</p>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom'; // Added

export default function TrainerDashboard() {
  const { user } = useAuth();
  const { getTraineesByTrainer } = useData();
  const [myTrainees, setMyTrainees] = useState([]);
  const navigate = useNavigate(); // Initialize

  useEffect(() => {
    const loadTrainees = async () => {
      if (!user?.id) return;
      const result = await getTraineesByTrainer(user.id);
      setMyTrainees(result || []);
    };
    loadTrainees();
  }, [user]);

  const completedTrainees = myTrainees.filter(t => t.grade && t.grade !== '');
  const pendingMarksheets = myTrainees.filter(t => !t.marks);

  const stats = [
    {
      title: 'My Trainees',
      value: myTrainees.length,
      icon: Users,
      color: 'bg-blue-500',
      change: `+${myTrainees.length} this month`
    },
    {
      title: 'Completed',
      value: completedTrainees.length,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Marksheets',
      value: pendingMarksheets.length,
      icon: FileText,
      color: 'bg-orange-500'
    },
    {
      title: 'ID Cards Issued',
      value: myTrainees.length,
      icon: CreditCard,
      color: 'bg-purple-500'
    }
  ];

  const recentTrainees = myTrainees.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-blue-100">
          You have {myTrainees.length} trainees under your guidance.
          {pendingMarksheets.length > 0 && ` ${pendingMarksheets.length} marksheets are pending.`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  {stat.change && (
                    <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Trainees</h3>
        </div>
        <div className="p-6">
          {recentTrainees.length > 0 ? (
            <div className="space-y-4">
              {recentTrainees.map((trainee) => (
                <div key={trainee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{trainee.fullName}</p>
                      <p className="text-sm text-gray-600">{trainee.moduleNumber} - {trainee.designation}</p>
                      <p className="text-xs text-gray-500">ID: {trainee.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {trainee.grade ? `Grade: ${trainee.grade}` : 'Pending'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Joined: {new Date(trainee.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No trainees added yet</p>
              <p className="text-sm text-gray-500 mt-1">Start by adding your first trainee using the form</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/add-trainee')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
              <h4 className="font-medium text-gray-900">Add New Trainee</h4>
            </div>
            <p className="text-sm text-gray-600 mt-1">Register a new trainee in the system</p>
          </button>
          <button 
            onClick={() => navigate('/marksheet')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-5 w-5 text-green-600 group-hover:text-green-700" />
              <h4 className="font-medium text-gray-900">Update Marksheets</h4>
            </div>
            <p className="text-sm text-gray-600 mt-1">Add or update trainee marks</p>
          </button>
          <button 
            onClick={() => navigate('/id-card')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-5 w-5 text-purple-600 group-hover:text-purple-700" />
              <h4 className="font-medium text-gray-900">Generate ID Cards</h4>
            </div>
            <p className="text-sm text-gray-600 mt-1">Create printable ID cards</p>
          </button>
        </div>
      </div>
    </div>
  );
}
