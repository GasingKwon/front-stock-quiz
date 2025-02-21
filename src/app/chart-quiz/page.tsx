'use client';

import React, { useState, useEffect } from 'react';
import { HintContainer } from '@/components/hint/HintContainer';
import { SearchBox } from '@/components/search/SearchBox';
import CandleChart from "@/components/chart/CandleChart";
import { ToastContainer, toast } from 'react-toastify';
import { ChevronDown, History } from 'lucide-react';
import Header from "@/components/layout/Header";
import 'react-toastify/dist/ReactToastify.css';

interface QuizItem {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    quiz_data: string;
    hint: string;
  }
  

interface QuizHistoryItem {
    created_at: string;
    round: number;
}

interface QuizState {
    solved: boolean;
    correct: boolean;
    attempts: number;
}


export default function StockChart() {
    const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [unlockedHints, setUnlockedHints] = useState(0);
    const [answer, setAnswer] = useState('');
    const [quizStates, setQuizStates] = useState<QuizState[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
    const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
    const [selectedRound, setSelectedRound] = useState<number | null>(null);
    const [isLoadingRound, setIsLoadingRound] = useState(false);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await fetch('/api/quiz/getQuiz', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('퀴즈 데이터를 불러오는데 실패했습니다.');
                }
                const data = await response.json();
                
                setQuizzes(data);
                setQuizStates(data.map(() => ({ solved: false, attempts: 0 })));

                // 이전 회차 데이터 불러오기
                const historyResponse = await fetch('/api/quiz/getQuizHistory', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (historyResponse.ok) {
                    const data = await historyResponse.json();
                    if (data.is_success && Array.isArray(data.history)) {
                        setQuizHistory(data.history);
                    }
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizData();
    }, []);

    const handleRoundSelect = async (round: number) => {
        setIsLoadingRound(true); // 🔄 로딩 시작
        setShowHistoryDropdown(false); // ✅ 회차 선택 시 드롭다운 닫기
    
        try {
            const response = await fetch(`/api/quiz/getQuiz?round=${round}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('이전 회차 데이터를 불러오는데 실패했습니다.');
            }
    
            const data = await response.json();
            setQuizzes(data);
            setSelectedRound(round);
    
            // ✅ 이전 회차도 처음부터 풀 수 있도록 초기화
            setQuizStates(data.map(() => ({ solved: false, attempts: 0 }))); 
            setCurrentQuizIndex(0);
            setUnlockedHints(0);
            setAnswer('');
        } catch (err) {
            console.error('Error checking answer:', err);
            toast.error('이전 회차 데이터를 불러오는데 실패했습니다.');
        } finally {
            setIsLoadingRound(false); // ✅ 로딩 완료 (지연 제거)
        }
    };
    


    const renderHistoryDropdown = () => (
        <div className="relative">
            <button
                onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
                <History size={20} />
                <span>이전 회차 보기</span>
                <ChevronDown size={20} />
            </button>

            {showHistoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                        {quizHistory.map((item, index) => (
                            <button
                                key={`${item.created_at}-${item.round}-${index}`}
                                onClick={() => handleRoundSelect(item.round)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex justify-between items-center"
                            >
                                <span>{item.round}회차</span>
                                <span className="text-sm text-gray-500">
                                    {new Date(item.created_at).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const handleUnlockHint = (hintNumber: number) => {
        if (hintNumber <= unlockedHints + 1) {
            setUnlockedHints(hintNumber);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmitAnswer = async () => {
        if (isSubmitting) return; // 이미 제출 중이면 중복 실행 방지
    
        setIsSubmitting(true); // 제출 시작
        try {
            const response = await fetch('/api/quiz/checkAnswer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quizId: quizzes[currentQuizIndex].id,
                    answer: answer
                })
            });
    
            const result = await response.json();
            const newQuizStates = [...quizStates];
            const currentState = newQuizStates[currentQuizIndex];
            const newAttempts = (currentState.attempts || 0) + 1;
    
            if (result.is_success) {
                newQuizStates[currentQuizIndex] = {
                    solved: true,
                    correct: true,
                    attempts: newAttempts
                };
                setQuizStates(newQuizStates);
    
                toast.success('정답입니다! 🎉', {
                    position: "top-center",
                    autoClose: 1500
                });
    
                // 다음 문제로 이동
                setTimeout(() => {
                    if (currentQuizIndex < quizzes.length - 1) {
                        setCurrentQuizIndex(prev => prev + 1);
                        setUnlockedHints(0);
                        setAnswer('');
                    } else {
                        toast.info('모든 문제를 완료했습니다! 🎊', {
                            position: "top-center",
                            autoClose: 1500
                        });
                    }
                    setIsSubmitting(false); // 다음 문제로 넘어갈 때 다시 버튼 활성화
                }, 1500);
    
            } else {
                if (newAttempts >= 3) {
                    newQuizStates[currentQuizIndex] = {
                        solved: true,
                        correct: false,
                        attempts: newAttempts
                    };
                    setQuizStates(newQuizStates);
    
                    toast.error('3번의 기회를 모두 사용했습니다. 다음 문제로 넘어갑니다.', {
                        position: "top-center",
                        autoClose: 1500
                    });
    
                    setTimeout(() => {
                        if (currentQuizIndex < quizzes.length - 1) {
                            setCurrentQuizIndex(prev => prev + 1);
                            setUnlockedHints(0);
                            setAnswer('');
                        } else {
                            toast.info('오늘의 문제는 끝났습니다! 다음 문제를 기대해주세요! 🎊', {
                                position: "top-center",
                                autoClose: 1500
                            });
                        }
                        setIsSubmitting(false); // 다음 문제로 넘어갈 때 다시 버튼 활성화
                    }, 1500);
                } else {
                    newQuizStates[currentQuizIndex] = {
                        ...currentState,
                        attempts: newAttempts
                    };
                    setQuizStates(newQuizStates);
    
                    toast.warning(`틀렸습니다. ${3 - newAttempts}번의 기회가 남았습니다.`, {
                        position: "top-center",
                        autoClose: 1500
                    });
    
                    setTimeout(() => {
                        setIsSubmitting(false); // 오답 메시지 후 버튼 다시 활성화
                    }, 1500);
                    
                    setAnswer('');
                }
            }
        } catch (err) {
            console.error('Error checking answer:', err);
            toast.error('오류가 발생했습니다. 다시 시도해주세요.', {
                position: "top-center",
                autoClose: 1500
            });
            setTimeout(() => {
                setIsSubmitting(false); // 오류 발생 시 버튼 다시 활성화
            }, 1500);
        }
    };

    if (loading || quizzes.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <svg className="animate-spin h-12 w-12 text-blue-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
            </div>
        );
    }
    if (error) return <div className="text-red-500">{error}</div>;

    const currentQuiz = quizzes.length > 0 ? quizzes[currentQuizIndex] : null;
    const parsedChartData = currentQuiz ? JSON.parse(currentQuiz.quiz_data) : [];
    const parsedHints: string[] = currentQuiz ? JSON.parse(currentQuiz.hint) : [];

    const highestRound = quizHistory.length > 0 
    ? Math.max(...quizHistory.map(q => Number(q.round))) 
    : null;

    const quizTitle = selectedRound ? `${selectedRound}회차 퀴즈` : highestRound ? `${highestRound}회차 퀴즈` : '오늘의 퀴즈';

    return (
        <div className="w-full h-screen max-w-lg mx-auto flex flex-col bg-gray-50 relative">
            {/* 상단 헤더 */}
            <Header />

            {/* 메인 콘텐츠 영역 */}
            <main className="flex-1 overflow-y-auto pt-16 pb-20 px-4">
                {isLoadingRound && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50">
                        <svg className="animate-spin h-12 w-12 text-blue-500" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span className="mt-2 text-gray-600">이전 회차 데이터를 불러오는 중...</span>
                    </div>
                )}
                <ToastContainer />
                
                {/* 퀴즈 진행 상태 */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-semibold">{quizTitle}</span>
                        <span className="text-sm text-gray-500">
                            {currentQuizIndex + 1}번째 문제
                        </span>
                    </div>
                    <div className="relative mt-2">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200"></div>
                        <div className="relative flex justify-between">
                            {quizStates.map((state, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div className={`
                                        w-4 h-4 rounded-full border-2 
                                        ${index === currentQuizIndex 
                                            ? 'bg-blue-500 border-blue-500'
                                            : state.solved
                                                ? state.correct 
                                                    ? 'bg-green-500 border-green-500'
                                                    : 'bg-red-500 border-red-500'
                                                : 'bg-white border-gray-300'
                                        }
                                    `}></div>
                                    <span className="mt-1 text-xs text-gray-500">
                                        {index + 1}번
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 이전 회차 선택 버튼 */}
                <div className="mb-4">
                    {renderHistoryDropdown()}
                </div>

                {/* 차트 영역 */}
                <div className="bg-white rounded-lg shadow-sm p-2 mb-4 relative">
                    {!loading && quizzes.length > 0 ? (
                        <CandleChart key={currentQuizIndex} chartData={parsedChartData} />
                    ) : (
                        <div className="h-40"></div> // ✅ 로딩 중이면 그냥 빈 공간 유지 (UI가 흔들리지 않도록)
                    )}
                </div>


                {/* 힌트 영역 */}
                <div className="bg-white rounded-lg shadow-sm mb-4 flex flex-col min-h-[100px] w-full relative">
                    <HintContainer
                        hints={parsedHints.map((hint, index) => ({
                            content: hint,
                            isLocked: selectedRound ? false : index + 1 > unlockedHints,
                            canUnlock: selectedRound ? true : index + 1 <= unlockedHints + 1,
                        }))}
                        onUnlock={handleUnlockHint}
                        unlockedHints={unlockedHints}
                    />
                </div>


                {/* 정답 입력 영역 */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <div className="flex gap-2">
                        <SearchBox
                            value={answer}
                            onChange={setAnswer}
                            onSubmit={() => answer && !quizStates[currentQuizIndex].solved && handleSubmitAnswer()}
                            placeholder="기업명을 입력하세요"
                            disabled={selectedRound !== null}
                        />
                        <button 
                            onClick={handleSubmitAnswer}
                            disabled={isSubmitting} // 제출 중이면 비활성화
                            className={`px-4 py-2 rounded-lg flex-shrink-0 text-white 
                                ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
                            `}
                        >
                            제출
                        </button>
                    </div>
                </div>
            </main>

            {/* 하단 네비게이션 바 */}
            {/* <footer className="bg-white border-t fixed bottom-0 left-0 right-0 max-w-lg mx-auto z-10">
                <nav>
                    <ul className="flex justify-around py-2">
                        <li>
                            <button className="flex flex-col items-center min-w-[64px] pt-1 text-blue-900">
                                <Home size={22} />
                                <span className="text-xs mt-1">홈</span>
                            </button>
                        </li>
                        <li>
                            <button className="flex flex-col items-center min-w-[64px] pt-1 text-gray-500">
                                <Trophy size={22} />
                                <span className="text-xs mt-1">순위표</span>
                            </button>
                        </li>
                        <li>
                            <button className="flex flex-col items-center min-w-[64px] pt-1 text-gray-500">
                                <History size={22} />
                                <span className="text-xs mt-1">기록</span>
                            </button>
                        </li>
                        <li>
                            <button className="flex flex-col items-center min-w-[64px] pt-1 text-gray-500">
                                <User size={22} />
                                <span className="text-xs mt-1">내 정보</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </footer> */}
        </div>
    );
}