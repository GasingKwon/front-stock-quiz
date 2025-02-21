'use client';
import { useState } from 'react';
import { LightbulbOff, Lightbulb } from 'lucide-react';

interface HintContainerProps {
    hints: {
        content: string;
        isLocked: boolean;
        canUnlock: boolean;
    }[];
    onUnlock: (hintIndex: number) => void;
    unlockedHints: number;
}

export function HintContainer({ hints, onUnlock, unlockedHints }: HintContainerProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // 표시할 힌트 개수 계산 (잠금 해제된 힌트 + 1개)
    const visibleHintsCount = Math.min(unlockedHints + 1, hints.length);

    const handleUnlock = (index: number) => {
        if (index <= unlockedHints + 1) {
            onUnlock(index + 1); // 인덱스는 0부터 시작하므로 +1을 해줍니다
        }
    };

    return (
        <section className="bg-white transition-all duration-300 ease-in-out flex-shrink-0 rounded-lg shadow-md border border-gray-200 w-full">
            <div className="relative p-4 w-full">
                {/* 힌트 버튼 및 제목 영역 */}
                <div className="flex items-center space-x-2 mb-[5px]">
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-12 h-12 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center focus:outline-none focus:ring-0 ml-[5px]"
                    >
                        <div className="relative w-6 h-6">
                            <LightbulbOff className={`h-6 w-6 text-gray-400 absolute top-0 left-0 transition-opacity duration-300 ${
                                isExpanded ? 'opacity-0' : 'opacity-100'
                            }`} />
                            <Lightbulb className={`h-6 w-6 text-yellow-500 absolute top-0 left-0 transition-opacity duration-300 ${
                                isExpanded ? 'opacity-100' : 'opacity-0'
                            }`} />
                        </div>
                    </button>
                    <h3 className="font-medium text-sm">유용한 힌트!</h3>
                </div>

                {/* 힌트 컨테이너 */}
                {isExpanded && (
                    <div className="bg-yellow-50 rounded-lg border border-yellow-100 transition-all duration-300 ease-in-out w-full h-auto max-h-[500px] overflow-y-auto p-3 flex flex-col">
                        <div className="mt-4 space-y-4 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {hints.slice(0, visibleHintsCount).map((hint, index) => (
                                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-sm">힌트 {index + 1}</span>
                                        {hint.isLocked && (
                                            <button
                                                onClick={() => handleUnlock(index)}
                                                disabled={!hint.canUnlock}
                                                className={`px-3 py-1 rounded text-sm ${
                                                    hint.canUnlock
                                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                            >
                                                공개하기
                                            </button>
                                        )}
                                    </div>
                                    <p className={`text-sm text-gray-600 ${hint.isLocked ? 'blur-sm select-none' : ''}`}>
                                        {hint.content}
                                    </p>
                                </div>
                            ))}
                            {visibleHintsCount < hints.length && (
                                <div className="text-center text-sm text-gray-500">
                                    다음 힌트를 보려면 현재 힌트를 먼저 확인하세요
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
