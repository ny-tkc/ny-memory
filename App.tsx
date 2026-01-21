
import React, { useState } from 'react';
import { TrainingMode } from './types';
import CalendarTrainer from './components/CalendarTrainer';
import NumberTrainer from './components/NumberTrainer';
import LetterPairTrainer from './components/LetterPairTrainer';
import BottomNav from './components/BottomNav';
import MasterEditor from './components/MasterEditor';
import CalendarHistory from './components/CalendarHistory';

const App: React.FC = () => {
  const [mode, setMode] = useState<TrainingMode>('calendar');
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const [isCalendarSettingsOpen, setIsCalendarSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const renderContent = () => {
    switch (mode) {
      case 'calendar':
        return (
          <CalendarTrainer 
            isSettingsOpen={isCalendarSettingsOpen} 
            setIsSettingsOpen={setIsCalendarSettingsOpen}
            isHistoryOpen={isHistoryOpen}
            setIsHistoryOpen={setIsHistoryOpen}
          />
        );
      case 'number':
        return <NumberTrainer />;
      case 'letterpair':
        return <LetterPairTrainer />;
      default:
        return <CalendarTrainer isSettingsOpen={isCalendarSettingsOpen} setIsSettingsOpen={setIsCalendarSettingsOpen} isHistoryOpen={isHistoryOpen} setIsHistoryOpen={setIsHistoryOpen}/>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <header className="bg-white border-b border-slate-200 py-3 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <i className="fa-solid fa-brain"></i>
          </div>
          <h1 className="font-bold text-slate-800 tracking-tight text-sm sm:text-base">MemoryPro</h1>
        </div>
        
        <div className="flex items-center gap-1.5">
          {mode === 'calendar' && (
            <>
              <button 
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 w-8 h-8 rounded-full transition-colors"
                title="履歴"
              >
                <i className="fa-solid fa-clock-rotate-left text-xs"></i>
              </button>
              <button 
                onClick={() => setIsCalendarSettingsOpen(true)}
                className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
              >
                <i className="fa-solid fa-sliders"></i>
                <span className="hidden xs:inline">設定</span>
              </button>
            </>
          )}
          {(mode === 'number' || mode === 'letterpair') && (
            <button 
              onClick={() => setIsMasterOpen(true)}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
            >
              <i className="fa-solid fa-gear"></i>
              <span>マスター登録</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-4 max-w-2xl flex flex-col">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex-grow flex flex-col relative">
          {renderContent()}
        </div>
      </main>

      {isMasterOpen && (mode === 'number' || mode === 'letterpair') && (
        <MasterEditor 
          mode={mode as 'number' | 'letterpair'} 
          onClose={() => setIsMasterOpen(false)} 
        />
      )}

      <BottomNav currentMode={mode} setMode={setMode} />
    </div>
  );
};

export default App;
