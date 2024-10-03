"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  // @ts-ignore
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    router.push('/chat'); // Redirect to /chat after form submission
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Right Corner - Signup and Home buttons */}
      <div className="absolute top-8 right-8 space-x-4">
        <button
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={() => router.push('/signup')}
        >
          Sign up
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
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="mb-4 text-3xl font-semibold">Login to Your Account</h1>
        <div className="bg-gray-800 p-10 rounded-lg shadow-md w-[90%] sm:w-[450px]">
          <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
            {/* Email or Username */}
            <div className="flex flex-col text-left">
              <label className="mb-2 font-bold text-gray-300">Email or Username</label>
              <input
                type="text"
                placeholder="Enter your email or username"
                className="text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col text-left">
              <label className="mb-2 font-bold text-gray-300">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full p-3 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 w-full">
        <p>&copy; 2024 Connectify. All rights reserved.</p>
      </footer>
    </div>
  );
}
