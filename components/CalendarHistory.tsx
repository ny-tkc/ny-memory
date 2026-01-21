
import React, { useMemo } from 'react';
import { CalendarSessionRecord, CalendarRange } from '../types';

interface CalendarHistoryProps {
  onClose: () => void;
}

const CalendarHistory: React.FC<CalendarHistoryProps> = ({ onClose }) => {
  const history: CalendarSessionRecord[] = useMemo(() => {
    return JSON.parse(localStorage.getItem('calendar_history') || '[]');
  }, []);

  const personalBests = useMemo(() => {
    const pbs: Record<string, CalendarSessionRecord> = {};
    history.forEach(session => {
      const key = session.range;
      if (!pbs[key] || session.finalScore < pbs[key].finalScore) {
        pbs[key] = session;
      }
    });
    return pbs;
  }, [history]);

  const formatTime = (ms: number) => {
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getRangeLabel = (range: CalendarRange) => {
    switch (range) {
      case 'birthday': return '誕生日';
      case 'competition': return '競技';
      case 'recent': return '最近';
      default: return range;
    }
  };

  return (
    <div className="flex-grow flex flex-col p-6 overflow-y-auto no-scrollbar bg-slate-50">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-trophy text-amber-500"></i>
          過去のデータ
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      {/* Personal Bests */}
      <section className="mb-8">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Personal Bests</div>
        <div className="grid grid-cols-3 gap-2">
          {(['recent', 'birthday', 'competition'] as CalendarRange[]).map(range => {
            const pb = personalBests[range];
            return (
              <div key={range} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-400 mb-1">{getRangeLabel(range)}</span>
                <span className="text-sm font-mono font-black text-indigo-600">
                  {pb ? formatTime(pb.finalScore) : '--.--s'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* History List */}
      <section className="flex-grow">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Training History</div>
        {history.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 text-slate-400 text-sm">
            履歴がありません。<br/>まずは練習を開始しましょう！
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((session) => (
              <div key={session.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                      {getRangeLabel(session.range)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {new Date(session.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-base font-mono font-black text-slate-700">
                    {formatTime(session.finalScore)}
                    {session.penaltySeconds > 0 && (
                      <span className="text-red-400 text-[10px] font-bold ml-2">
                        (+{session.penaltySeconds}s)
                      </span>
                    )}
                  </div>
                </div>
                {session.isCorrectAll ? (
                  <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center border border-green-100">
                    <i className="fa-solid fa-check text-xs"></i>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center border border-slate-100">
                    <span className="text-[10px] font-black">{5 - session.penaltySeconds/10}/5</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="pt-8 mt-auto">
        <button
          onClick={onClose}
          className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default CalendarHistory;
