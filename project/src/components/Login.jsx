// import React, { useState } from 'react';
// import { Train, Eye, EyeOff } from 'lucide-react';
// import Image from "../../public/STC_logo.png"
// import { useAuth } from '../context/AuthContext';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       const success = await login(email, password);
//       if (!success) {
//         setError('Invalid email or password');
//       }
//     } catch (err) {
//       setError('Login failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className=" p-3 rounded-full">
//              <img src={Image} className="h-28 w-40 text-white" />
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Supervisors Training Centre</h1>
//           <p className="text-gray-600"> Northern Railway</p>
//           <p className="text-sm text-gray-500">Login</p>
//         </div>

//         <div className="bg-blue-50 p-4 rounded-lg mb-6">
//           <p className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</p>
//           <div className="text-xs text-blue-700">
//             <p><strong>Director:</strong> director@stc.railway.gov.in</p>
//             <p><strong>Trainer:</strong> trainer1@stc.railway.gov.in</p>
//             <p><strong>Password:</strong> password123</p>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter your password"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               </button>
//             </div>
//           </div>

//           {error && (
//             <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? 'Signing In...' : 'Sign In'}
//           </button>
//         </form>

//         <div className="mt-6 text-center text-xs text-gray-500">
//           <p>STC Training Management System </p>
//           <p>Northern Railway - Government of India</p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { Train, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Image from '../../public/STC_logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        const user = JSON.parse(localStorage.getItem('stc_user'));
        if (user.role === 'director') {
          navigate('/director/dashboard');
        } else if (user.role === 'trainer') {
          navigate('/trainer/dashboard');
        } else {
          setError('Unauthorized role');
        }
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full">
              <img src={Image} className="h-28 w-40 text-white" alt="STC Logo" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Supervisors Training Centre</h1>
          <p className="text-gray-600">Northern Railway</p>
          <p className="text-sm text-gray-500">Login</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</p>
          <div className="text-xs text-blue-700">
            <p><strong>Director:</strong> director@stc.in</p>
            <p><strong>Trainer:</strong> riya123@gov.in</p>
            <p><strong>Trainer Password:</strong>riya123</p>
            <p><strong>Director Password:</strong> director123</p>
            
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>STC Training Management System</p>
          <p>Northern Railway - Government of India</p>
        </div>
      </div>
    </div>
  );
}
