import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import GoogleAd from "@/components/layout/GoogleAd";

export default function Home() {
  return (
    <div className="w-full h-screen max-w-lg mx-auto flex flex-col bg-gray-50 relative">
      <Header />
      <main className="flex-1 overflow-y-auto pt-16 px-4 py-8">
        <section>
          <div className="grid grid-cols-1 gap-6 mt-5">
            {/* 주식차트퀴즈 */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-4">주식차트퀴즈</h2>
              <p className="mb-4 text-gray-600">차트를 보고 어떤 기업인지 맞춰보세요!</p>
              <Link
                href="/chart-quiz"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg w-full text-center"
              >
                시작하기
              </Link>
            </div>

            {/* 주식분석퀴즈 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4">주식분석퀴즈</h2>
              <p className="mb-4 text-gray-600">기업 정보를 분석하고 투자 결정을 해보세요!</p>
              <button
                disabled
                className="inline-block bg-gray-300 text-gray-500 px-4 py-2 rounded-lg w-full text-center cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>

            {/* 주식사?말아? */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4">주식사?말아?</h2>
              <p className="mb-4 text-gray-600">현재 시점에서 매수할지 말지 결정해보세요!</p>
              <button
                disabled
                className="inline-block bg-gray-300 text-gray-500 px-4 py-2 rounded-lg w-full text-center cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </section>
      </main>
        {/* 하단 광고 영역 */}
        <footer className="bg-white border-t py-4 flex justify-center">
          <GoogleAd adSlot="4816676004" />
        </footer>
    </div>
  );
}
