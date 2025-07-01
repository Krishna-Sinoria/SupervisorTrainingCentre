// import React from 'react';
// import { Users, UserCheck, GraduationCap, TrendingUp, UserPlus } from 'lucide-react';
// import { useData } from '../../context/DataContext'; // 🔁 Will now fetch from backend

// export default function DirectorDashboard({ onNavigate }) {
//   // ⬇️ These are expected to come from backend now (via DataContext)
//   const { getAnalytics, trainees, trainers } = useData();
//   const analytics = getAnalytics(); // Should be based on real-time data

//   // Example logic that depends on fetched data
//   const activeTrainersCount = trainers.filter(t => t.active).length;
//   const completedTrainees = trainees.filter(t => t.grade && t.grade !== '').length;
//   const completionRate = trainees.length > 0
//     ? Math.round((completedTrainees / trainees.length) * 100)
//     : 0;

//   // These static values can later be dynamic (e.g., fetched from backend too)
//   const stats = [
//     {
//       title: 'Total Trainees',
//       value: analytics.totalTrainees,
//       icon: Users,
//       color: 'bg-blue-500',
//       change: '+12%' // Optional: make dynamic later
//     },
//     {
//       title: 'Active Trainers',
//       value: activeTrainersCount,
//       icon: UserCheck,
//       color: 'bg-green-500',
//       change: '+5%'
//     },
//     {
//       title: 'Courses Running',
//       value: '8', // 🔁 Optional: fetch from backend later
//       icon: GraduationCap,
//       color: 'bg-purple-500',
//       change: '+2%'
//     },
//     {
//       title: 'Completion Rate',
//       value: `${completionRate}%`,
//       icon: TrendingUp,
//       color: 'bg-orange-500',
//       change: '+8%'
//     }
//   ];

//   // This function is based on timestamps (make sure createdAt exists in backend)
//   const getTimeAgo = (dateString) => {
//     const now = new Date();
//     const date = new Date(dateString);
//     const diffInMinutes = Math.floor((now - date) / (1000 * 60));

//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

//     const diffInHours = Math.floor(diffInMinutes / 60);
//     if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

//     const diffInDays = Math.floor(diffInHours / 24);
//     if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

//     return date.toLocaleDateString();
//   };

//   // 🔁 This now assumes backend returns trainee.createdAt, trainer.joinDate, etc.
//   const generateRecentActivities = () => {
//     const activities = [];

//     // Recent trainees
//     const recentTrainees = trainees.sort((a, b) =>
//       new Date(b.createdAt) - new Date(a.createdAt)
//     ).slice(0, 2);

//     recentTrainees.forEach((trainee) => {
//       activities.push({
//         id: `trainee-${trainee.id}`,
//         action: 'New trainee registered',
//         details: `${trainee.fullName} - ${trainee.moduleNumber} Module`,
//         time: getTimeAgo(trainee.createdAt),
//         type: 'registration'
//       });
//     });

//     // Recent marksheets
//     const recentMarksheets = trainees
//       .filter(t => t.grade)
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//       .slice(0, 1);

//     if (recentMarksheets.length > 0) {
//       const trainee = recentMarksheets[0];
//       activities.push({
//         id: `marksheet-${trainee.id}`,
//         action: 'Marksheet generated',
//         details: `${trainee.fullName} - Grade ${trainee.grade}`,
//         time: getTimeAgo(trainee.createdAt),
//         type: 'marksheet'
//       });
//     }

//     // Recent trainer
//     const recentTrainers = trainers
//       .filter(t => t.joinDate)
//       .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
//       .slice(0, 1);

//     if (recentTrainers.length > 0) {
//       const trainer = recentTrainers[0];
//       activities.push({
//         id: `trainer-${trainer.id}`,
//         action: 'New trainer added',
//         details: `${trainer.name} - ${trainer.department}`,
//         time: getTimeAgo(trainer.joinDate),
//         type: 'trainer'
//       });
//     }

//     // If nothing, show default message
//     if (activities.length === 0) {
//       activities.push({
//         id: 'default',
//         action: 'System initialized',
//         details: 'STC Training Management System is ready',
//         time: 'Today',
//         type: 'system'
//       });
//     }

//     return activities.slice(0, 4);
//   };

//   const recentActivities = generateRecentActivities();

//   return (
//     // ✅ No need to change this structure — all data is dynamic from context
//    <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
//                   <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
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
//           <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
//         </div>
//         <div className="p-6">
//           <div className="space-y-4">
//             {recentActivities.map((activity) => (
//               <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
//                 <div className={`p-2 rounded-full ${
//                   activity.type === 'registration' ? 'bg-blue-100 text-blue-600' :
//                   activity.type === 'marksheet' ? 'bg-green-100 text-green-600' :
//                   activity.type === 'id-card' ? 'bg-purple-100 text-purple-600' :
//                   activity.type === 'trainer' ? 'bg-indigo-100 text-indigo-600' :
//                   'bg-gray-100 text-gray-600'
//                 }`}>
//                   <div className="w-2 h-2 rounded-full bg-current"></div>
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-900">{activity.action}</p>
//                   <p className="text-sm text-gray-600">{activity.details}</p>
//                   <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <button 
//             onClick={() => onNavigate?.('add-trainee')}
//             className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
//           >
//             <div className="flex items-center gap-3 mb-2">
//               <UserPlus className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
//               <h3 className="font-medium text-gray-900">Add New Trainee</h3>
//             </div>
//             <p className="text-sm text-gray-600">Register a new trainee directly</p>
//           </button>
//           <button 
//             onClick={() => onNavigate?.('analytics')}
//             className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
//           >
//             <div className="flex items-center gap-3 mb-2">
//               <TrendingUp className="h-5 w-5 text-green-600 group-hover:text-green-700" />
//               <h3 className="font-medium text-gray-900">View Analytics</h3>
//             </div>
//             <p className="text-sm text-gray-600">Detailed reports and insights</p>
//           </button>
//           <button 
//             onClick={() => onNavigate?.('roles')}
//             className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
//           >
//             <div className="flex items-center gap-3 mb-2">
//               <Users className="h-5 w-5 text-purple-600 group-hover:text-purple-700" />
//               <h3 className="font-medium text-gray-900">Manage Trainers</h3>
//             </div>
//             <p className="text-sm text-gray-600">Add, edit, or remove trainers</p>
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Trainer Overview</h3>
//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Total Trainers</span>
//               <span className="font-semibold text-gray-900">{trainers.length}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Active Trainers</span>
//               <span className="font-semibold text-green-600">{activeTrainersCount}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Inactive Trainers</span>
//               <span className="font-semibold text-red-600">{trainers.length - activeTrainersCount}</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Progress</h3>
//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Total Trainees</span>
//               <span className="font-semibold text-gray-900">{trainees.length}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Completed</span>
//               <span className="font-semibold text-green-600">{completedTrainees}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">In Progress</span>
//               <span className="font-semibold text-orange-600">{trainees.length - completedTrainees}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react';
import {
  Users,
  UserCheck,
  GraduationCap,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom'; // ✅ Added for routing

export default function DirectorDashboard() {
  const { getAnalytics, trainees, trainers } = useData();
  const analytics = getAnalytics();
  const navigate = useNavigate(); // ✅ Initialize router navigate

  const activeTrainersCount = trainers.filter(t => t.active).length;
  const completedTrainees = trainees.filter(t => t.grade && t.grade !== '').length;
  const completionRate = trainees.length > 0
    ? Math.round((completedTrainees / trainees.length) * 100)
    : 0;

  const stats = [
    {
      title: 'Total Trainees',
      value: analytics.totalTrainees,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Trainers',
      value: activeTrainersCount,
      icon: UserCheck,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Courses Running',
      value: '8',
      icon: GraduationCap,
      color: 'bg-purple-500',
      change: '+2%'
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+8%'
    }
  ];

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const generateRecentActivities = () => {
    const activities = [];

    const recentTrainees = trainees.sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    ).slice(0, 2);

    recentTrainees.forEach((trainee) => {
      activities.push({
        id: `trainee-${trainee.id}`,
        action: 'New trainee registered',
        details: `${trainee.fullName} - ${trainee.moduleNumber} Module`,
        time: getTimeAgo(trainee.createdAt),
        type: 'registration'
      });
    });

    const recentMarksheets = trainees
      .filter(t => t.grade)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 1);

    if (recentMarksheets.length > 0) {
      const trainee = recentMarksheets[0];
      activities.push({
        id: `marksheet-${trainee.id}`,
        action: 'Marksheet generated',
        details: `${trainee.fullName} - Grade ${trainee.grade}`,
        time: getTimeAgo(trainee.createdAt),
        type: 'marksheet'
      });
    }

    const recentTrainers = trainers
      .filter(t => t.joinDate)
      .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
      .slice(0, 1);

    if (recentTrainers.length > 0) {
      const trainer = recentTrainers[0];
      activities.push({
        id: `trainer-${trainer.id}`,
        action: 'New trainer added',
        details: `${trainer.name} - ${trainer.department}`,
        time: getTimeAgo(trainer.joinDate),
        type: 'trainer'
      });
    }

    if (activities.length === 0) {
      activities.push({
        id: 'default',
        action: 'System initialized',
        details: 'STC Training Management System is ready',
        time: 'Today',
        type: 'system'
      });
    }

    return activities.slice(0, 4);
  };

  const recentActivities = generateRecentActivities();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
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
          <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
        </div>
        <div className="p-6 space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${
                activity.type === 'registration' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'marksheet' ? 'bg-green-100 text-green-600' :
                activity.type === 'id-card' ? 'bg-purple-100 text-purple-600' :
                activity.type === 'trainer' ? 'bg-indigo-100 text-indigo-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                <div className="w-2 h-2 rounded-full bg-current"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/add-trainee')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
              <h3 className="font-medium text-gray-900">Add New Trainee</h3>
            </div>
            <p className="text-sm text-gray-600">Register a new trainee directly</p>
          </button>
          <button 
            onClick={() => navigate('/analytics')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600 group-hover:text-green-700" />
              <h3 className="font-medium text-gray-900">View Analytics</h3>
            </div>
            <p className="text-sm text-gray-600">Detailed reports and insights</p>
          </button>
          <button 
            onClick={() => navigate('/roles')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-purple-600 group-hover:text-purple-700" />
              <h3 className="font-medium text-gray-900">Manage Trainers</h3>
            </div>
            <p className="text-sm text-gray-600">Add, edit, or remove trainers</p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trainer Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Trainers</span>
              <span className="font-semibold text-gray-900">{trainers.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Trainers</span>
              <span className="font-semibold text-green-600">{activeTrainersCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Inactive Trainers</span>
              <span className="font-semibold text-red-600">{trainers.length - activeTrainersCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Trainees</span>
              <span className="font-semibold text-gray-900">{trainees.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <span className="font-semibold text-green-600">{completedTrainees}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">In Progress</span>
              <span className="font-semibold text-orange-600">{trainees.length - completedTrainees}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
