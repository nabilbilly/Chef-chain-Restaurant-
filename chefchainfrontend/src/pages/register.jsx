import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ChefHat } from "lucide-react";
import { registerUser } from "../services/auth";

export default function RestaurantSignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }
    if (!agreeToTerms) {
      setMessage("❌ Please agree to the terms and conditions.");
      return;
    }

    try {
      const data = await registerUser({ username, email, password });
      setMessage("✅ Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // small delay before redirect
    } catch (error) {
      setMessage("❌ Error: " + (error.response?.data?.error || "Registration failed"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 w-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-orange-500 mb-2">HTU Restaurant </h1>
          <p className="text-gray-600 text-sm">Create your restaurant management account</p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start">
            <input
              id="agree-terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="agree-terms" className="ml-2 text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Sign Up */}
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 outline-none"
          >
            Sign Up
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
          {/* {message && (
            <div className="text-center text-sm mt-4 font-medium text-red-600">{message}</div>
          )} */}
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-700 hover:text-orange-500 font-medium">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { registerUser } from "../services/auth";

// export default function Register() {
//   const [form, setForm] = useState({ username: "", email: "", password: "" });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate(); // hook for redirect

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = await registerUser(form);
//       setMessage("Registration successful! You can now login.");
//       // Redirect to dashboard
//       navigate("/login");
//     } catch (error) {
//       setMessage("Error: " + (error.response?.data?.error || "Failed"));
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 space-y-4">
//       <input name="username" onChange={handleChange} placeholder="Username" className="border p-2 w-full" />
//       <input name="email" onChange={handleChange} placeholder="Email" type="email" className="border p-2 w-full" />
//       <input name="password" onChange={handleChange} placeholder="Password" type="password" className="border p-2 w-full" />
//       <button type="submit" className="bg-blue-500 text-white p-2">Register</button>
//       <p>{message}</p>
//     </form>
//   );
// }
