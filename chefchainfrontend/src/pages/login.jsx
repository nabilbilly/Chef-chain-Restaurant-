import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/auth';
import { parseJwt } from '../utils/jwt';
import { Eye, EyeOff, Mail, Lock, ChefHat } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('Logging in...');
  
  try {
    console.log('🔄 Attempting login with:', form); // DEBUG
    const data = await loginUser(form);
    console.log('✅ Login response received:', data); // DEBUG
    
    if (!data?.access) {
      console.log('❌ No access token in response');
      setMessage('Login failed: no access token returned.');
      return;
    }

    // Store tokens
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    console.log('💾 Tokens stored in localStorage');

    // Decode role with better error handling
    const payload = parseJwt(data.access);
    console.log('🔓 Decoded JWT payload:', payload); // DEBUG
    
    if (!payload) {
      console.log('❌ Failed to decode JWT');
      setMessage('Failed to decode access token.');
      return;
    }

    // Log all possible role fields
    console.log('🔍 Checking role fields:');
    console.log('  - payload.role:', payload.role);
    console.log('  - payload.user_role:', payload.user_role);
    console.log('  - payload.username_role:', payload.username_role);
    console.log('  - payload.user?.role:', payload.user?.role);
    console.log('  - payload.roles:', payload.roles);

    // Try multiple possible role field names
    const role = payload.role || 
                 payload.user_role || 
                 payload.username_role || 
                 payload.user?.role ||
                 (Array.isArray(payload.roles) ? payload.roles[0] : payload.roles);

    console.log('🎭 Final extracted role:', role);
    console.log('🎭 Role type:', typeof role);

    // Clear message before navigation
    setMessage('');

    // Route by role with more debugging
    console.log('🧭 Starting navigation logic...');
    switch (role) {
      case 'customer':
        console.log('➡️ Navigating to /ordering');
        navigate('/ordering', { replace: true });
        break;
      case 'admin':
      case 'manager':
        console.log('➡️ Navigating to /dashboard');
        navigate('/dashboard', { replace: true });
        break;
      case 'chef':
        console.log('➡️ Navigating to /kitchen');
        navigate('/kitchen', { replace: true });
        break;
      case 'rider':
        console.log('➡️ Navigating to /rider');
        navigate('/rider', { replace: true });
        break;
      default:
        console.warn('⚠️ Unknown or undefined role:', role);
        console.log('➡️ Navigating to default /ordering');
        navigate('/ordering', { replace: true });
    }

  } catch (error) {
    console.error('💥 Login error:', error);
    console.error('💥 Error details:', error.response?.data);
    setMessage('Login failed: ' + (error.response?.data?.detail || error.message));
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center w-screen p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-orange-500 mb-2">HTU Restaurant </h1>
          <p className="text-gray-600 text-sm">Sign in to access your restaurant dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
              {/* Forgot password? */}
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 outline-none"
          >
            Login In
          </button>

          {/* Message */}
          {message && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                <p className="text-gray-800">{message}</p>
                <button
                  onClick={() => setMessage("")}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            New to our platform?{' '}
            <Link
              to="/register"
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium" >
              Create an account
            </Link>
            {/* <a href="{/register}" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
              Create an account
            </a> */}
          </p>
        </div>
      </div>
    </div>
  );
}


// src/pages/Login.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { loginUser } from '../services/auth';
// import { parseJwt } from '../utils/jwt';

// export default function Login() {
//   const [form, setForm] = useState({ username: '', password: '' });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('Logging in...');
//     try {
//       const data = await loginUser(form); // { access, refresh }
//       if (!data?.access) {
//         setMessage('Login failed: no access token returned.');
//         return;
//       }

//       // Store tokens consistently:
//       localStorage.setItem('accessToken', data.access);
//       localStorage.setItem('refreshToken', data.refresh);

//       // Decode role from token
//       const payload = parseJwt(data.access);
//       const role = payload?.role ?? payload?.username_role ?? null;

//       // Route by role
//       if (role === 'customer') {
//         navigate('/ordering');
//         return;
//       }
//       // Admin / Manager -> dashboard
//       if (role === 'admin' || role === 'manager') {
//         navigate('/dashboard');
//         return;
//       }
//       // Optional: chef/waiter routes
//       if (role === 'chef') {
//         navigate('/kitchen');
//         return;
//       }
//       if (role === 'rider') {
//         navigate('/rider');
//         return;
//       }

//       // Fallback: go to dashboard
//       navigate('/dashboard');
//     } catch (error) {
//       console.error(error);
//       setMessage('Login failed: ' + (error.response?.data?.detail || error.message));
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">
//       <h2 className="text-xl font-bold">Login</h2>
//       <input name="username" onChange={handleChange} placeholder="Username" className="border p-2 w-full" />
//       <input name="password" onChange={handleChange} placeholder="Password" type="password" className="border p-2 w-full" />
//       <button type="submit" className="bg-green-500 text-white p-2 w-full">Login</button>
//       <p className="text-sm text-red-600 mt-2">{message}</p>
//     </form>
//   );
// }












// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../services/auth";

// export default function Login() {
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate(); // hook for redirect

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = await loginUser(form);

//       // Store JWT
//       localStorage.setItem("accessToken", data.access); // match what dashboard expects

//       setMessage("Login successful!");

//       // Redirect to ordering page
//       navigate("/ordering");
//     } catch (error) {
//       setMessage("Error: " + (error.response?.data?.error || "Failed"));
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 space-y-4">
//       <input
//         name="username"
//         onChange={handleChange}
//         placeholder="Username"
//         className="border p-2 w-full"
//       />
//       <input
//         name="password"
//         onChange={handleChange}
//         placeholder="Password"
//         type="password"
//         className="border p-2 w-full"
//       />
//       <button type="submit" className="bg-green-500 text-white p-2">
//         Login
//       </button>
//       <p>{message}</p>
//     </form>
//   );
// }
