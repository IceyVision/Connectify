"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Left Corner - Logo */}
      <div className="absolute top-8 left-8">
        <h1 className="text-4xl font-bold">Connectify</h1>
      </div>
      
      {/* Top Right Corner - Login and Signup */}
      <div className="absolute top-8 right-8 space-x-4">
        <button
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={() => router.push('/login')}
        >
          Login
        </button>
        <button
          className="px-6 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700"
          onClick={() => router.push('/signup')}
        >
          Sign Up
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-extrabold">
          Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">rural areas</span> by
          breaking <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">language barriers</span> and fostering understanding between <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">people</span>.
        </h1>
        <button className="px-10 mt-7 font-bold py-4 text-white text-xl bg-blue-600 rounded-xl hover:bg-blue-700"
          onClick={() => router.push('/login')}>
          Get started
        </button>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 self-end w-full">
        <p>&copy; 2024 Connectify. All rights reserved.</p>
      </footer>
    </div>
  );
}
