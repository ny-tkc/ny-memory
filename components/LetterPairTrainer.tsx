
import React, { useState, useEffect } from 'react';
import { HIRAGANA_SET, MasterMapping } from '../types';

const LetterPairTrainer: React.FC = () => {
  const [currentPair, setCurrentPair] = useState(generateRandomPair());
  const [history, setHistory] = useState<string[]>([]);
  const [mappings, setMappings] = useState<MasterMapping>({});

  useEffect(() => {
    const saved = localStorage.getItem('memory_pro_letters');
    if (saved) setMappings(JSON.parse(saved));
  }, []);

  function generateRandomPair() {
    const char1 = HIRAGANA_SET[Math.floor(Math.random() * HIRAGANA_SET.length)];
    const char2 = HIRAGANA_SET[Math.floor(Math.random() * HIRAGANA_SET.length)];
    return `${char1}${char2}`;
  }

  const nextPair = () => {
    setHistory(prev => [currentPair, ...prev].slice(0, 5));
    setCurrentPair(generateRandomPair());
  };

  const currentWord = mappings[currentPair];

  return (
    <div className="flex-grow flex flex-col p-6 sm:p-8">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">レターペア</h2>
        <p className="text-xs text-slate-400 font-medium">ひらがな二文字のランダム表示</p>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative text-center">
          <div className="absolute -inset-10 bg-emerald-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="relative text-9xl font-bold text-emerald-600 tracking-widest mb-4">
            {currentPair}
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
          {history.map((pair, i) => (
            <span key={i} className="text-sm font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              {pair}
            </span>
          ))}
        </div>
        <button
          onClick={nextPair}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold py-6 rounded-2xl shadow-xl shadow-emerald-100 transition-all transform active:scale-95"
        >
          次へ <i className="fa-solid fa-chevron-right ml-2 text-sm"></i>
        </button>
      </div>
    </div>
  );
};

export default LetterPairTrainer;
