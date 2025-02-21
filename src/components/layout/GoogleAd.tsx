"use client"; // 클라이언트 컴포넌트 선언

import { useEffect } from "react";

// 전역 타입 선언: window.adsbygoogle은 object 타입의 요소들을 가진 배열임을 명시
declare global {
  interface Window {
    adsbygoogle: object[];
  }
}

interface GoogleAdProps {
  adSlot?: string; // Google AdSense에서 제공하는 광고 슬롯 ID
  className?: string; // 추가적인 스타일 적용을 위한 클래스
}

export default function GoogleAd({ className = "" }: GoogleAdProps) {
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (e) {
      console.error("Google AdSense error:", e);
    }
  }, []);

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT} // Google AdSense 발급한 광고 ID로 변경
        data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
