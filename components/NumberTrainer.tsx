
import React, { useState, useEffect } from 'react';
import { MasterMapping } from '../types';

const NumberTrainer: React.FC = () => {
  const [currentNumber, setCurrentNumber] = useState(generateRandomNumber());
  const [history, setHistory] = useState<string[]>([]);
  const [mappings, setMappings] = useState<MasterMapping>({});

  useEffect(() => {
    const saved = localStorage.getItem('memory_pro_numbers');
    if (saved) setMappings(JSON.parse(saved));
  }, []);

  function generateRandomNumber() {
    const num = Math.floor(Math.random() * 100);
    return num.toString().padStart(2, '0');
  }

  const nextNumber = () => {
    setHistory(prev => [currentNumber, ...prev].slice(0, 5));
    setCurrentNumber(generateRandomNumber());
  };

  const currentWord = mappings[currentNumber];

  return (
    <div className="flex-grow flex flex-col p-6 sm:p-8">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">ナンバー記憶</h2>
        <p className="text-xs text-slate-400 font-medium">00 〜 99 のランダム表示</p>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative text-center">
          <div className="absolute -inset-10 bg-indigo-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="relative text-9xl font-bold text-indigo-600 font-mono tracking-tighter mb-4">
            {currentNumber}
          </div>
          {currentWord && (
            <div className="relative text-2xl font-bold text-slate-400 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {currentWord}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {history.map((num, i) => (
            <span key={i} className="text-xs font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              {num}
            </span>
          ))}
        </div>
        <button
          onClick={nextNumber}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-6 rounded-2xl shadow-xl shadow-indigo-100 transition-all transform active:scale-95"
        >
          次へ <i className="fa-solid fa-chevron-right ml-2 text-sm"></i>
        </button>
      </div>
    </div>
  );
};

export default NumberTrainer;
