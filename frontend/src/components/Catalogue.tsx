import React, { useState, useMemo } from 'react';
import type { Item } from '../types';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface CatalogueProps {
  items: Item[];
  onSelect: (item: Item) => void;
  selectedId?: string;
}

export const Catalogue: React.FC<CatalogueProps> = ({ items, onSelect, selectedId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGame, setFilterGame] = useState<'all' | 'cs' | 'boh'>('all');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const game = item.game; // Assuming 'game' property exists on items from dataService normalization
      const matchesGame = filterGame === 'all' || 
                          (filterGame === 'cs' && game === 'Cultist Simulator') ||
                          (filterGame === 'boh' && game === 'Book of Hours');

      return matchesSearch && matchesGame;
    });
  }, [items, searchTerm, filterGame]);

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filter Header */}
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-md pb-4 border-b border-gold/20 mb-4 space-y-3">
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gold/50" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gold/30 rounded-sm leading-5 bg-black/20 text-parchment placeholder-parchment/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold sm:text-sm font-serif transition-colors"
            placeholder="搜索书籍..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-black/20 p-1 rounded-sm border border-gold/10">
          <button
            onClick={() => setFilterGame('all')}
            className={`flex-1 py-1 text-xs font-display tracking-wider transition-colors ${filterGame === 'all' ? 'bg-gold/20 text-gold' : 'text-parchment/50 hover:text-parchment'}`}
          >
            全部
          </button>
          <button
            onClick={() => setFilterGame('cs')}
            className={`flex-1 py-1 text-xs font-display tracking-wider transition-colors ${filterGame === 'cs' ? 'bg-purple-500/20 text-purple-300' : 'text-parchment/50 hover:text-parchment'}`}
          >
            密教
          </button>
          <button
            onClick={() => setFilterGame('boh')}
            className={`flex-1 py-1 text-xs font-display tracking-wider transition-colors ${filterGame === 'boh' ? 'bg-sky-500/20 text-sky-300' : 'text-parchment/50 hover:text-parchment'}`}
          >
            司辰
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-parchment/30 italic font-serif text-sm">
            未找到相关记录...
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={`
                p-3 border border-transparent cursor-pointer transition-all duration-300 group
                hover:border-gold/30 hover:bg-gold/5
                ${selectedId === item.id ? 'border-gold bg-gold/10 shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'border-b-gold/10'}
              `}
            >
              <h3 
                className={`font-display text-sm transition-colors ${selectedId === item.id ? 'text-gold' : 'text-parchment group-hover:text-gold/80'}`}
                dangerouslySetInnerHTML={{ __html: item.name }}
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-parchment/40 font-serif italic truncate max-w-[70%]">
                  {item.game === 'Cultist Simulator' ? '密教模拟器' : '司辰之书'}
                </span>
                {Object.keys(item.aspects).length > 0 && (
                  <div className="flex gap-1">
                    {/* Just showing a dot for now, could be icons later */}
                    <div className="w-1.5 h-1.5 rounded-full bg-gold/40"></div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
