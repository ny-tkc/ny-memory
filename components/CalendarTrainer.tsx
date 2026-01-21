
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DAYS_JP, LapRecord, CalendarRange, CalendarSettings, getJapaneseEra, CalendarSessionRecord } from '../types';
import CalendarSettingsModal from './CalendarSettingsModal';
import CalendarHistory from './CalendarHistory';

interface Props {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
}

const CalendarTrainer: React.FC<Props> = ({ isSettingsOpen, setIsSettingsOpen, isHistoryOpen, setIsHistoryOpen }) => {
  const [gameState, setGameState] = useState<'idle' | 'range_select' | 'countdown' | 'playing' | 'finished'>('idle');
  const [selectedRange, setSelectedRange] = useState<CalendarRange>('recent');
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [questions, setQuestions] = useState<Date[]>([]);
  const [laps, setLaps] = useState<LapRecord[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [feedback, setFeedback] = useState<{ index: number; isCorrect: boolean } | null>(null);
  const [countdownText, setCountdownText] = useState('');
  
  const [settings, setSettings] = useState<CalendarSettings>(() => {
    const saved = localStorage.getItem('calendar_settings');
    return saved ? JSON.parse(saved) : {
      yearMode: 'both',
      countdownSeconds: 3,
      showNumbers: false,
      startDay: 0
    };
  });

  const timerRef = useRef<number | null>(null);

  const saveSettings = (newSettings: CalendarSettings) => {
    setSettings(newSettings);
    localStorage.setItem('calendar_settings', JSON.stringify(newSettings));
  };

  const generateRandomDate = (range: CalendarRange) => {
    let startYear, endYear;
    const now = new Date();
    
    switch (range) {
      case 'birthday':
        startYear = now.getFullYear() - 80;
        endYear = now.getFullYear();
        break;
      case 'competition':
        startYear = 1500;
        endYear = 2500;
        break;
      case 'recent':
      default:
        startYear = now.getFullYear() - 1;
        endYear = now.getFullYear() + 1;
        break;
    }

    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    return new Date(year, month, day);
  };

  const startCountdown = (range: CalendarRange) => {
    setSelectedRange(range);
    setLaps([]);
    setFeedback(null);
    setGameState('countdown');
    
    const dates = Array.from({ length: 5 }, () => generateRandomDate(range));
    setQuestions(dates);

    let count = settings.countdownSeconds;
    setCountdownText(count.toString());
    
    const interval = window.setInterval(() => {
      count -= 1;
      if (count === 0) {
        setCountdownText('START!');
      } else if (count < 0) {
        clearInterval(interval);
        startTraining();
      } else {
        setCountdownText(count.toString());
      }
    }, 1000);
  };

  const startTraining = () => {
    setActiveQuestion(0);
    setGameState('playing');
    const now = performance.now();
    setStartTime(now);
    setCurrentTime(now);
  };

  const updateTimer = useCallback(() => {
    if (gameState === 'playing') {
      setCurrentTime(performance.now());
      timerRef.current = requestAnimationFrame(updateTimer);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    }
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [gameState, updateTimer]);

  const handleAnswer = (dayIndex: number) => {
    if (gameState !== 'playing' || feedback) return;

    const targetDate = questions[activeQuestion];
    const correctDayIndex = targetDate.getDay();
    const isCorrect = dayIndex === correctDayIndex;
    const now = performance.now();
    const lapTime = now - startTime;

    setFeedback({ index: activeQuestion, isCorrect });

    const record: LapRecord = {
      questionNumber: activeQuestion + 1,
      date: formatDate(targetDate),
      time: lapTime,
      correct: isCorrect,
      userAnswer: DAYS_JP[dayIndex],
      correctAnswer: DAYS_JP[correctDayIndex],
    };

    setLaps(prev => [...prev, record]);

    setTimeout(() => {
      setFeedback(null);
      if (activeQuestion < 4) {
        setActiveQuestion(prev => prev + 1);
      } else {
        finishGame([...laps, record], now);
      }
    }, 300);
  };

  const finishGame = (finalLaps: LapRecord[], endTime: number) => {
    setGameState('finished');
    const totalTimeMs = endTime - (endTime - (currentTime - (performance.now() - endTime))); // approximation or just raw total
    const rawTotal = finalLaps.reduce((acc, lap) => acc + lap.time, 0); // more accurate is elapsed from start to end
    const totalRawTime = endTime - (endTime - currentTime); // Use our actual tracked time
    
    const mistakes = finalLaps.filter(l => !l.correct).length;
    const penaltyMs = mistakes * 10000;
    
    const session: CalendarSessionRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      range: selectedRange,
      totalTime: totalRawTime,
      penaltySeconds: mistakes * 10,
      finalScore: totalRawTime + penaltyMs,
      isCorrectAll: mistakes === 0,
      laps: finalLaps,
      settings: settings
    };

    const history = JSON.parse(localStorage.getItem('calendar_history') || '[]');
    history.unshift(session);
    localStorage.setItem('calendar_history', JSON.stringify(history.slice(0, 100)));
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const era = getJapaneseEra(date);
    
    if (settings.yearMode === 'japanese') return `${era} ${m}月${d}日`;
    if (settings.yearMode === 'both') return `${y}年(${era}) ${m}月${d}日`;
    return `${y}年${m}月${d}日`;
  };

  const formatTime = (ms: number) => {
    const totalSeconds = ms / 1000;
    return `${totalSeconds.toFixed(2)}s`;
  };

  const getDayList = () => {
    const list = DAYS_JP.map((label, index) => ({ label, index }));
    if (settings.startDay === 1) {
      const monOnwards = list.slice(1);
      monOnwards.push(list[0]);
      return monOnwards;
    }
    return list;
  };

  if (isSettingsOpen) return <CalendarSettingsModal settings={settings} onSave={saveSettings} onClose={() => setIsSettingsOpen(false)} />;
  if (isHistoryOpen) return <CalendarHistory onClose={() => setIsHistoryOpen(false)} />;

  if (gameState === 'idle') {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 p-6 bg-indigo-50 rounded-full text-indigo-600 shadow-inner">
          <i className="fa-solid fa-calendar-check text-5xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">カレンダー計算</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-xs">
          5問連続でタイムを計測。<br/>
          不正解は<span className="text-red-500 font-bold">+10秒</span>のペナルティ。
        </p>
        <button
          onClick={() => setGameState('range_select')}
          className="w-full max-w-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all transform active:scale-95"
        >
          はじめる
        </button>
      </div>
    );
  }

  if (gameState === 'range_select') {
    const ranges = [
      { id: 'recent', label: '最近', desc: '去年 〜 来年', icon: 'fa-clock-rotate-left' },
      { id: 'birthday', label: '誕生日', desc: '過去80年', icon: 'fa-cake-candles' },
      { id: 'competition', label: '競技', desc: '1500年 〜 2500年', icon: 'fa-trophy' },
    ];
    return (
      <div className="flex-grow flex flex-col p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">出題範囲を選択</h2>
        <div className="space-y-3">
          {ranges.map((range) => (
            <button
              key={range.id}
              onClick={() => startCountdown(range.id as CalendarRange)}
              className="w-full flex items-center p-4 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-2xl transition-all group shadow-sm"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-inner mr-4 transition-colors">
                <i className={`fa-solid ${range.icon} text-xl`}></i>
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-700 group-hover:text-indigo-700">{range.label}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{range.desc}</div>
              </div>
              <i className="fa-solid fa-chevron-right ml-auto text-slate-300 group-hover:text-indigo-300"></i>
            </button>
          ))}
        </div>
        <button onClick={() => setGameState('idle')} className="mt-8 text-slate-400 text-sm hover:text-slate-600 transition-colors underline underline-offset-4 decoration-slate-200">キャンセル</button>
      </div>
    );
  }

  if (gameState === 'countdown') {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 bg-indigo-600 text-white transition-colors duration-500">
        <div className="text-8xl sm:text-[10rem] font-black animate-in zoom-in fade-in duration-300">
          {countdownText}
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="flex-grow flex flex-col p-4 sm:p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SESSION TIMER</span>
            <span className="text-2xl font-mono font-bold text-slate-800">{formatTime(currentTime - startTime)}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PROGRESS</span>
            <span className="text-2xl font-bold text-indigo-600">{activeQuestion + 1} <span className="text-slate-300 text-base">/ 5</span></span>
          </div>
        </div>

        <div className="flex-grow space-y-4 overflow-y-auto pr-1 no-scrollbar mb-6">
          {questions.map((date, idx) => {
            const isCompleted = idx < laps.length;
            const isActive = idx === activeQuestion;
            return (
              <div 
                key={idx}
                className={`p-4 rounded-3xl border transition-all duration-300 flex items-center justify-between
                  ${isActive ? 'bg-indigo-50 border-indigo-200 scale-100 shadow-md ring-2 ring-indigo-500/10' : 
                    isCompleted ? 'bg-slate-50 border-slate-100 opacity-60 scale-95' : 
                    'bg-white border-slate-100 opacity-30 scale-90'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-inner
                    ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {idx + 1}
                  </div>
                  <div className={`font-bold transition-all ${isActive ? 'text-lg sm:text-xl text-slate-800' : 'text-slate-400'}`}>
                    {formatDate(date)}
                  </div>
                </div>
                {isCompleted && (
                  <div className={`text-xl ${laps[idx]?.correct ? 'text-green-500' : 'text-red-500'}`}>
                    <i className={`fa-solid ${laps[idx]?.correct ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-auto grid grid-cols-7 gap-1">
          {getDayList().map(({ label, index }) => (
            <button
              key={label}
              onClick={() => handleAnswer(index)}
              className={`py-5 flex flex-col items-center justify-center gap-1 rounded-xl transition-all shadow-sm transform active:scale-90 border
                ${index === 0 ? 'text-red-500 bg-red-50 border-red-100' : 
                  index === 6 ? 'text-blue-500 bg-blue-50 border-blue-100' : 
                  'text-slate-700 bg-white border-slate-200'}
                ${feedback && feedback.index === activeQuestion ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <span className="font-bold text-sm sm:text-base">{label}</span>
              {settings.showNumbers && <span className="text-[9px] font-black opacity-40">{index}</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const latestSession: CalendarSessionRecord | null = JSON.parse(localStorage.getItem('calendar_history') || '[]')[0] || null;

  return (
    <div className="flex-grow flex flex-col p-6 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-square-poll-vertical text-indigo-600"></i>
          リザルト
        </h2>
        <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{new Date(latestSession?.timestamp || Date.now()).toLocaleDateString()}</div>
      </div>
      
      {latestSession && (
        <div className="bg-indigo-600 text-white rounded-3xl p-6 mb-8 shadow-xl shadow-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="relative">
            <div className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">TOTAL TIME (WITH PENALTY)</div>
            <div className="text-5xl font-mono font-black mb-4">
              {formatTime(latestSession.finalScore)}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm font-bold bg-white/10 p-4 rounded-2xl">
              <div>
                <span className="opacity-70 block text-[10px] uppercase">Raw Time</span>
                {formatTime(latestSession.totalTime)}
              </div>
              <div>
                <span className="opacity-70 block text-[10px] uppercase">Penalty</span>
                <span className={latestSession.penaltySeconds > 0 ? 'text-red-200' : ''}>
                  +{latestSession.penaltySeconds}s
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 mb-8">
        {laps.map((lap, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-inner ${lap.correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {lap.questionNumber}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold">{lap.date}</span>
                <span className="text-sm font-bold text-slate-700">
                  {lap.userAnswer} 
                  {!lap.correct && <span className="text-red-400 ml-1">→ {lap.correctAnswer}</span>}
                </span>
              </div>
            </div>
            {lap.correct ? <i className="fa-solid fa-circle-check text-green-500"></i> : <i className="fa-solid fa-circle-xmark text-red-400"></i>}
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-3 pb-4">
        <button
          onClick={() => startCountdown(selectedRange)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all transform active:scale-95"
        >
          もう一度
        </button>
        <button
          onClick={() => setGameState('range_select')}
          className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all"
        >
          条件を変える
        </button>
      </div>
    </div>
  );
};

export default CalendarTrainer;
