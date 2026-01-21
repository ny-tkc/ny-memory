
import React from 'react';
import { TrainingMode } from '../types';

interface BottomNavProps {
  currentMode: TrainingMode;
  setMode: (mode: TrainingMode) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { id: 'calendar', label: 'カレンダー', icon: 'fa-calendar-days' },
    { id: 'number', label: 'ナンバー', icon: 'fa-hashtag' },
    { id: 'letterpair', label: 'レターペア', icon: 'fa-language' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-pb z-50">
      <div className="container mx-auto max-w-2xl px-2 h-16 flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id as TrainingMode)}
            className={`flex flex-col items-center justify-center w-full h-full transition-all gap-1 ${
              currentMode === item.id
                ? 'text-indigo-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`text-xl ${currentMode === item.id ? 'scale-110' : ''}`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            {currentMode === item.id && (
              <div className="w-1 h-1 bg-indigo-600 rounded-full absolute bottom-2"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
