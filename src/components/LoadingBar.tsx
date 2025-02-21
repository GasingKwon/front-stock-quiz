"use client"; // ✅ 클라이언트 컴포넌트 지정

import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function LoadingBar() {
  const pathname = usePathname(); // ✅ 현재 경로 감지
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLoading(true);
    NProgress.start();

    // ✅ 일정 시간 후 로딩 종료
    const timer = setTimeout(() => {
      setLoading(false);
      NProgress.done();
    }, 1000); // 1초 후 로딩 완료

    return () => clearTimeout(timer);
  }, [pathname]); // ✅ 경로가 변경될 때마다 실행

  return loading || isPending ? (
    <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse z-50"></div>
  ) : null;
}
