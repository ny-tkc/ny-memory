
import React, { useState, useEffect } from 'react';
import { HIRAGANA_SET, MasterMapping } from '../types';

interface MasterEditorProps {
  mode: 'number' | 'letterpair';
  onClose: () => void;
}

const MasterEditor: React.FC<MasterEditorProps> = ({ mode, onClose }) => {
  const [mappings, setMappings] = useState<MasterMapping>({});
  const [search, setSearch] = useState('');
  
  const storageKey = mode === 'number' ? 'memory_pro_numbers' : 'memory_pro_letters';

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setMappings(JSON.parse(saved));
  }, [storageKey]);

  const saveMapping = (key: string, value: string) => {
    const newMappings = { ...mappings, [key]: value };
    setMappings(newMappings);
    localStorage.setItem(storageKey, JSON.stringify(newMappings));
  };

  const items = mode === 'number' 
    ? Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'))
    : HIRAGANA_SET.flatMap(h1 => HIRAGANA_SET.map(h2 => h1 + h2));

  const filteredItems = items.filter(item => 
    item.includes(search) || (mappings[item] && mappings[item].includes(search))
  );

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      <header className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          <h2 className="font-bold text-slate-800">
            {mode === 'number' ? 'ナンバー' : 'レターペア'} マスター登録
          </h2>
        </div>
        <div className="text-xs text-slate-400 font-bold">{filteredItems.length}件表示中</div>
      </header>

      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="組み合わせを検索..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {filteredItems.slice(0, 50).map((item) => (
            <div key={item} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="w-14 h-10 bg-slate-50 flex items-center justify-center rounded-xl font-bold text-indigo-600 border border-slate-100">
                {item}
              </div>
              <input 
                type="text" 
                placeholder="関連ワードを入力"
                className="flex-grow py-2 px-3 text-sm focus:outline-none bg-transparent"
                value={mappings[item] || ''}
                onChange={(e) => saveMapping(item, e.target.value)}
              />
            </div>
          ))}
          {filteredItems.length > 50 && (
            <div className="text-center py-4 text-slate-400 text-xs italic">
              上位50件のみ表示しています。さらに絞り込むには検索してください。
            </div>
          )}
        </div>
      </div>

      <footer className="p-4 border-t border-slate-200 bg-white">
        <button 
          onClick={onClose}
          className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-900 transition-colors"
        >
          保存して閉じる
        </button>
      </footer>
    </div>
  );
};

export default MasterEditor;
