
import React from 'react';
import { TrainingMode } from '../types';

interface NavbarProps {
  currentMode: TrainingMode;
  setMode: (mode: TrainingMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { id: 'calendar', label: 'カレンダー', icon: 'fa-calendar-days' },
    { id: 'number', label: 'ナンバー', icon: 'fa-hashtag' },
    { id: 'letterpair', label: 'レターペア', icon: 'fa-language' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <i className="fa-solid fa-brain text-xl"></i>
            </div>
            <span className="font-bold text-slate-800 text-lg hidden sm:block">MemoryPro</span>
          </div>
          <div className="flex gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setMode(item.id as TrainingMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  currentMode === item.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                <span className="hidden xs:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
