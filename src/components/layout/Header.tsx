"use client"; // ✅ 클라이언트 컴포넌트 선언

import { Home } from "lucide-react";

export default function Header() {
  const handleHomeClick = () => {
    window.location.href = "/";
  };

  return (
    <header className="bg-blue-900 text-white py-4 px-4 fixed top-0 left-0 right-0 max-w-lg mx-auto z-10 flex items-center justify-between">
      <h1 className="text-xl font-bold">주식퀴즈</h1>
      <button onClick={handleHomeClick} className="text-white">
        <Home size={24} />
      </button>
    </header>
  );
}
