"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const languages = ["English", "Spanish", "French", "German", "Mandarin", "Hindi", "Arabic"];
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute top-8 right-8 space-x-4">
        <button
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={() => router.push('/login')}
        >
          Login
        </button>
        <button
          className="px-6 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700"
          onClick={() => router.push('/')}
        >
          Home
        </button>
      </div>
      {/* Top Left Corner - Logo */}
      <div className="absolute top-8 left-8">
        <h1 className="text-4xl font-bold">Connectify</h1>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-3xl font-semibold">Create Your Account</h1>

        {/* Form Container */}
        <div className="bg-gray-800 p-10 rounded-lg shadow-md w-[90%] sm:w-[450px]">
          <form className="flex flex-col space-y-6">
            {/* Username */}
            <div className="flex flex-col text-left">
              <label className="font-bold mb-2 text-gray-300">Username</label>
              <input
                type="text"
                placeholder="Enter a username"
                className="text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col text-left">
              <label className="font-bold mb-2 text-gray-300">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col text-left">
              <label className="font-bold mb-2 text-gray-300">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                className="text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            

            {/* Confirm Password */}
            <div className="flex flex-col text-left">
              <label className="font-bold mb-2 text-gray-300">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                className="text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Language Dropdown */}
            <div className="flex flex-col text-left">
              <label className="font-bold mb-2 text-gray-300">Default Base Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select Default Base Language
                </option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-3 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 self-end w-full">
        <p>&copy; 2024 Connectify. All rights reserved.</p>
      </footer>
    </div>
  );
}
