
import React from 'react';
import { CalendarSettings } from '../types';

interface CalendarSettingsModalProps {
  settings: CalendarSettings;
  onSave: (settings: CalendarSettings) => void;
  onClose: () => void;
}

const CalendarSettingsModal: React.FC<CalendarSettingsModalProps> = ({ settings, onSave, onClose }) => {
  const handleChange = (key: keyof CalendarSettings, value: any) => {
    onSave({ ...settings, [key]: value });
  };

  return (
    <div className="flex-grow flex flex-col p-6 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-gear text-indigo-600"></i>
          カレンダー設定
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      <div className="space-y-6">
        <section>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">表示形式</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'western', label: '西暦' },
              { id: 'japanese', label: '和暦' },
              { id: 'both', label: '併記' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => handleChange('yearMode', option.id)}
                className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                  settings.yearMode === option.id
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                    : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">カウントダウン</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[3, 5, 10].map((sec) => (
              <button
                key={sec}
                onClick={() => handleChange('countdownSeconds', sec)}
                className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                  settings.countdownSeconds === sec
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                    : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
              >
                {sec}秒
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <div className="font-bold text-slate-700 text-sm">曜日に数字を表示</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">0=SUN, 1=MON...</div>
            </div>
            <button
              onClick={() => handleChange('showNumbers', !settings.showNumbers)}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.showNumbers ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${settings.showNumbers ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <div className="font-bold text-slate-700 text-sm">週の開始曜日</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SUN OR MON START</div>
            </div>
            <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200">
              {[
                { id: 0, label: '日' },
                { id: 1, label: '月' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleChange('startDay', opt.id)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    settings.startDay === opt.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-auto pt-8">
        <button
          onClick={onClose}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-95"
        >
          保存
        </button>
      </div>
    </div>
  );
};

export default CalendarSettingsModal;
